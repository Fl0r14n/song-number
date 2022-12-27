import {Component, OnInit} from '@angular/core';
import {ModalController, NavParams} from '@ionic/angular';
import {Book, BookCollection} from '../../shared/models';

@Component({
  selector: 'select-book-modal',
  template: `
    <ion-header>
      <ion-toolbar>
        <ion-title class="ion-text-center">
          {{ 'pages.selectBookModal.title' | translate}}
        </ion-title>
        <ion-buttons slot="end">
          <ion-button color="primary" (click)="dismiss()">
            <ion-icon slot="icon-only" name="close-circle"></ion-icon>
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>
    <ion-content>
      <ion-list inset>
        <ng-container *ngFor="let collection of collections">
          <ion-item-divider>
            <ion-label>{{collection.name}}</ion-label>
          </ion-item-divider>
          <ion-item *ngFor="let item of collection.books" (click)="selectBook(item)"
                    [color]="item == book? 'primary': ''">
            <ion-thumbnail slot="start">
              <img [src]="item.thumb" alt="item-thumb">
            </ion-thumbnail>
            <ion-label>
              <h2>{{item.title}}</h2>
              <p>{{item.description}}</p>
            </ion-label>
          </ion-item>
        </ng-container>
      </ion-list>
    </ion-content>

  `
})
export class SelectBookModalComponent implements OnInit {

  collections: BookCollection[] | undefined;
  book: Book | undefined;

  constructor(private modalCtrl: ModalController,
              private params: NavParams) {
  }

  async selectBook(item: Book) {
    return await this.modalCtrl.dismiss(item);
  }

  async dismiss() {
    return await this.modalCtrl.dismiss();
  }

  ngOnInit() {
    this.collections = this.params.get('collections');
    this.book = this.params.get('book');
  }
}
