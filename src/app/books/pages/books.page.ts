import {Component, OnInit, QueryList, ViewChildren} from '@angular/core';
import {AlertController, IonItemSliding, ModalController} from '@ionic/angular';
import {SongNumberService} from '../../shared/services/song-number.service';
import {Book, BookCollection} from '../../shared/models/api';
import {TranslateService} from '@ngx-translate/core';
import {BookModalPageComponent} from '../components/book-modal/book-modal.component';
import {CollectionModalComponent} from '../components/collection-modal/collection-modal.component';

@Component({
  selector: 'books-page',
  templateUrl: 'books.page.html'
})
export class BooksPageComponent implements OnInit {

  i18n: Record<string, any> = {};
  @ViewChildren('slidersRef')
  slidersRef: QueryList<IonItemSliding> | undefined;

  constructor(private songNumberService: SongNumberService,
              private modalCtrl: ModalController,
              private i18nService: TranslateService,
              private alertCtrl: AlertController) {
  }

  get collections() {
    return this.songNumberService.collections;
  }

  get activeBook() {
    return this.songNumberService.book;
  }

  async reorderBook(collection: BookCollection, {detail}: CustomEvent) {
    const {books} = collection;
    books && books.splice(detail.to, 0, books.splice(detail.from, 1)[0]);
    await detail.complete(true);
  }

  removeBook(item: Book, collection: BookCollection) {
    this.i18nService.get('pages.books.removeBook', {value: item.title}).subscribe(async (value) => {
      const confirm = await this.alertCtrl.create({
        header: value,
        message: this.i18n['pages.books.permanentRemoval'],
        buttons: [
          {
            text: this.i18n['pages.books.cancel'],
            handler: () => {
              this.closeItemSliders();
            }
          },
          {
            text: this.i18n['pages.books.remove'],
            handler: () => {
              this.closeItemSliders();
              this.songNumberService.deleteBook(item, collection);
            }
          }
        ]
      });
      await confirm.present();
    });
  }

  async editBook(book: Book, collection: BookCollection) {
    const modal = await this.modalCtrl.create({
      component: BookModalPageComponent,
      componentProps: {
        book,
        collection,
        collections: this.collections,
      }
    });
    await modal.present();
    const {data} = await modal.onDidDismiss();
    this.closeItemSliders();
    if (data) {
      // did the collection change?
      if (data.label === collection.name) {
        delete data.label;
        this.songNumberService.editBook(book, data);
      } else {
        this.songNumberService.deleteBook(book, collection);
        const {label} = data;
        delete data.label;
        this.songNumberService.addBook(data, label);
      }
      delete data.label;
      this.songNumberService.book = data;
    }
  }

  async reorderCollections() {
    const modal = await this.modalCtrl.create({
      component: CollectionModalComponent
    });
    await modal.present();
  }

  async addBook() {
    const modal = await this.modalCtrl.create({
      component: BookModalPageComponent,
      componentProps: {
        book: {},
        collections: this.collections,
      }
    });
    await modal.present();
    const {data} = await modal.onDidDismiss();
    this.closeItemSliders();
    if (data) {
      const {label} = data;
      delete data.label;
      this.songNumberService.addBook(data, label);
      this.songNumberService.book = data;
    }
  }

  private closeItemSliders() {
    // workaround for item-slider
    this.slidersRef?.forEach(v => v.close());
  }

  ngOnInit(): void {
    this.i18nService.get([
      'pages.books.cancel',
      'pages.books.remove',
      'pages.books.permanentRemoval',
      'pages.books.removeBook',
    ]).subscribe((value) => {
      this.i18n = value;
    });
  }
}
