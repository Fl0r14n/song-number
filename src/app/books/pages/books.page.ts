import {Component, QueryList, ViewChildren} from '@angular/core';
import {AlertController, IonItemSliding, ItemReorderEventDetail, ModalController} from '@ionic/angular';
import {TranslateService} from '@ngx-translate/core';
import {Book, BookCollection} from '../../shared/models';
import {SongBooksService, SongNumberService} from '../../shared/services';
import {BookModalPageComponent} from '../components/book-modal.component';
import {CollectionModalComponent} from '../components/collection-modal.component';

@Component({
  selector: 'books-page',
  template: `
    <ion-header>
      <ion-toolbar>
        <ion-title>
          <ion-icon name="list"></ion-icon>
          {{'pages.books.title' | translate}}
        </ion-title>
        <ion-buttons slot="primary">
          <ion-button color="primary" (click)="reorderCollections()">
            <ion-icon name="reorder-four-outline"></ion-icon>
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">
      <ion-item-group *ngFor="let collection of collections">
        <ion-item-sliding #slidersRef>
          <ion-item>
            <ion-label color="medium">{{collection.name}}</ion-label>
          </ion-item>
          <ion-item-options side="end">
            <ion-item-option color="primary" (click)="collection.reorder = !collection.reorder">
              <ion-icon name="reorder-four-outline"></ion-icon>
            </ion-item-option>
          </ion-item-options>
        </ion-item-sliding>

        <ion-reorder-group [disabled]="!collection.reorder" (ionItemReorder)="reorderBook(collection, $any($event))">
          <ion-item-sliding *ngFor="let book of collection.books" #slidersRef>
            <ion-item [color]="book == activeBook? 'primary': ''">
              <ion-thumbnail slot="start">
                <img [src]="book.thumb" alt="book-thumb">
              </ion-thumbnail>
              <ion-label>
                <h2>{{book.title}}</h2>
                <p>{{book.description}}</p>
              </ion-label>
              <ion-reorder slot="end"></ion-reorder>
            </ion-item>
            <ion-item-options side="start">
              <ion-item-option color="secondary" (click)="editBook(book, collection)">
                <ion-icon name="create" size="large"></ion-icon>
              </ion-item-option>
            </ion-item-options>
            <ion-item-options side="end">
              <ion-item-option color="danger" (click)="removeBook(book, collection)">
                <ion-icon name="trash" size="large"></ion-icon>
              </ion-item-option>
            </ion-item-options>
          </ion-item-sliding>
        </ion-reorder-group>
      </ion-item-group>

      <ion-fab vertical="bottom" horizontal="end" slot="fixed">
        <ion-fab-button (click)="addBook()">
          <ion-icon name="add"></ion-icon>
        </ion-fab-button>
      </ion-fab>
    </ion-content>
  `
})
export class BooksPageComponent {

  i18n: Record<string, any> = this.i18nService.instant([
    'pages.books.cancel',
    'pages.books.remove',
    'pages.books.permanentRemoval',
    'pages.books.removeBook',
  ]);
  @ViewChildren('slidersRef')
  slidersRef: QueryList<IonItemSliding> | undefined;

  constructor(private songBooksService: SongBooksService,
              private songNumberService: SongNumberService,
              private modalCtrl: ModalController,
              private i18nService: TranslateService,
              private alertCtrl: AlertController) {
  }

  get collections() {
    return this.songBooksService.collections.model;
  }

  get activeBook() {
    return this.songNumberService.book.model;
  }

  async reorderBook(collection: BookCollection, {detail}: CustomEvent<ItemReorderEventDetail>) {
    const {books} = collection;
    books && books.splice(detail.to, 0, books.splice(detail.from, 1)[0]);
    await detail.complete(true);
  }

  async removeBook(item: Book, collection: BookCollection) {
    const confirm = await this.alertCtrl.create({
      header: this.i18nService.instant('pages.books.removeBook', {value: item.title}),
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
            this.songBooksService.deleteBook(item, collection);
          }
        }
      ]
    });
    await confirm.present();
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
        this.songBooksService.editBook(book, data);
      } else {
        this.songBooksService.deleteBook(book, collection);
        const {label} = data;
        delete data.label;
        this.songBooksService.addBook(data, label);
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
      this.songBooksService.addBook(data, label);
      this.songNumberService.book = data;
    }
  }

  private closeItemSliders() {
    // workaround for item-slider
    this.slidersRef?.forEach(v => v.close());
  }
}
