import {Component, OnInit, QueryList, ViewChildren} from '@angular/core';
import {AlertController, IonItemSliding, ModalController} from '@ionic/angular';
import {SongNumberService} from '../../shared/services/song-number.service';
import {Book, BookCollection} from '../../shared/models/api';
import {noop} from 'rxjs';
import {TranslateService} from '@ngx-translate/core';
import {BookModalPageComponent} from '../components/book-modal/book-modal.component';

@Component({
  selector: 'books-page',
  templateUrl: 'books.page.html'
})
export class BooksPageComponent implements OnInit {

  i18n: any[];
  @ViewChildren('booksListRef')
  booksListRef: QueryList<IonItemSliding>;

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
      confirm.present().then(noop, noop);
    });
  }

  async editBook(book: Book, collection: BookCollection) {
    const modal = await this.modalCtrl.create({
      component: BookModalPageComponent,
      componentProps: {
        book,
        collection,
        collections: this.songNumberService.collections,
      }
    });
    await modal.present();
    const {data} = await modal.onDidDismiss();
    this.closeItemSliders();
    if (data) {
      // did the section change?
      if (data.section === collection.section) {
        this.sBook(data, book, collection);
      } else {
        this.dBook(book, collection);
        this.cBook(data);
      }
      delete data.section;
      this.songNumberService.book = data;
    }
  }

  async addBook() {
    const modal = await this.modalCtrl.create({
      component: BookModalPageComponent,
      componentProps: {
        book: {},
        collections: this.songNumberService.collections,
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
      delete data.section;
      // replace it
      collection.books.splice(idx, 1, data);
    }
  }

  private dBook(book, collection) {
    const idx = collection.books.findIndex(i => i.title === book.title && i.description === book.description);
    if (idx > -1) {
      // delete from existing
      collection.books.splice(idx, 1);
    }
  }

  private cBook(data) {
    let newCollection = this.songNumberService.collections.find(c => c.section === data.section);
    if (!newCollection) {
      // we have a new collection so save it
      newCollection = {
        section: data.section,
        books: []
      };
      this.songNumberService.collections.push(newCollection);
    }
    delete data.section;
    // push it to new collection
    newCollection.books.push(data);
  }

  private closeItemSliders() {
    // workaround for item-slider
    this.booksListRef.forEach(v => v.close());
  }

  ngOnInit(): void {
    this.i18nService.get([
      'pages.books.cancel',
      'pages.books.remove',
      'pages.books.permanentRemoval',
      'pages.books.removeBook'
    ]).subscribe((value) => {
      this.i18n = value;
    });
  }
}
