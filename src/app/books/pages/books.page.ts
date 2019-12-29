import {Component, OnInit, QueryList, ViewChildren} from '@angular/core';
import {AlertController, IonItemSliding, ModalController} from '@ionic/angular';
import {SongNumberService} from '../../shared/services/song-number.service';
import {Book, BookCollection} from '../../shared/models/api';
import {TranslateService} from '@ngx-translate/core';
import {BookModalPageComponent} from '../components/book-modal/book-modal.component';

@Component({
  selector: 'books-page',
  templateUrl: 'books.page.html'
})
export class BooksPageComponent implements OnInit {

  i18n: any[];
  @ViewChildren('slidersRef')
  slidersRef: QueryList<IonItemSliding>;

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
              const idx = collection.books.indexOf(item);
              collection.books.splice(idx, 1);
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
        this.sBook(data, book, collection);
      } else {
        this.dBook(book, collection);
        this.cBook(data);
      }
      delete data.label;
      this.songNumberService.book = data;
    }
  }

  removeCollection(collection) {
    this.i18nService.get('pages.books.removeBook', {
      value: collection.name
    }).subscribe(async (value) => {
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
              const idx = this.collections.indexOf(collection);
              this.collections.splice(idx, 1);
            }
          }
        ]
      });
      await confirm.present();
    });
  }

  editCollection(collection) {
    this.i18nService.get('pages.books.editDialog', {
      value: collection.name
    }).subscribe(async (value) => {
      const confirm = await this.alertCtrl.create({
        header: value,
        inputs: [
          {
            name: 'label',
            placeholder: this.i18n['pages.books.collection'],
            type: 'text',
            value: collection.name
          }
        ],
        buttons: [
          {
            text: this.i18n['pages.books.cancel'],
            handler: () => {
              this.closeItemSliders();
            }
          },
          {
            text: this.i18n['pages.books.edit'],
            handler: (data) => {
              this.closeItemSliders();
              collection.name = data.label;
            }
          }
        ]
      });
      await confirm.present();
    });
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
      this.cBook(data);
      this.songNumberService.book = data;
    }
  }

  private sBook(data, book, collection) {
    const idx = collection.books.findIndex(i => i.title === book.title && i.description === book.description);
    if (idx > -1) {
      delete data.label;
      collection.books[idx] = data;
    }
  }

  private dBook(book, collection) {
    const idx = collection.books.findIndex(i => i.title === book.title && i.description === book.description);
    if (idx > -1) {
      collection.books.splice(idx, 1);
    }
  }

  private cBook(data) {
    const collection = this.collections.find(c => c.name === data.label);
    delete data.label;
    collection.books.push(data);
  }

  private closeItemSliders() {
    // workaround for item-slider
    this.slidersRef.forEach(v => v.close());
  }

  ngOnInit(): void {
    this.i18nService.get([
      'pages.books.edit',
      'pages.books.cancel',
      'pages.books.remove',
      'pages.books.permanentRemoval',
      'pages.books.removeBook',
      'pages.books.collection',
    ]).subscribe((value) => {
      this.i18n = value;
    });
  }
}
