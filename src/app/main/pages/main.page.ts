import {Component, OnDestroy} from '@angular/core';
import {AlertController, ModalController} from '@ionic/angular';
import {TranslateService} from '@ngx-translate/core';
import {from} from 'rxjs';
import {filter, map, switchMap} from 'rxjs/operators';
import {SongBooksService, SongNumberService} from '../../shared/services';
import {SelectBookModalComponent} from '../components/select-book-modal.component';

@Component({
  selector: 'main-page',
  template: `
    <ng-container>
      <ion-header>
        <ion-toolbar>
          <ion-title>
            <ion-icon name="musical-notes"></ion-icon>
            {{ 'pages.main.title' | translate}}
          </ion-title>
          <ion-fab-button slot="end"
                          [disabled]="button.disabled"
                          [color]="button.color"
                          (click)="songNumberService.cast()"
                          *ngIf="songNumberService.castButton$ | async as button">
            <img [src]="button.icon" alt="cast-icon">
          </ion-fab-button>
        </ion-toolbar>
      </ion-header>

      <ion-content class="ion-padding">
        <song-number [digits]="songNumberService.digits.model"></song-number>

        <ion-item class="ion-padding-start ion-padding-end">
          <ion-label position="floating">{{ 'pages.main.notes' | translate}}</ion-label>
          <ion-input type="text" [(ngModel)]="songNumberService.notes.model"></ion-input>
        </ion-item>

        <ion-item (click)="openSelectBookModal()" class="ion-padding">
          <ion-thumbnail slot="start" *ngIf="book?.thumb">
            <img [src]="book.thumb" alt="book-thumb">
          </ion-thumbnail>
          <ion-label>
            <h2 [hidden]="book">{{ 'pages.main.book' | translate}}</h2>
            <h3 *ngIf="book">{{book.title}}</h3>
            <p *ngIf="book">{{book.description}}</p>
          </ion-label>
        </ion-item>

        <ion-fab vertical="bottom" horizontal="start" slot="fixed">
          <ion-fab-button [disabled]="button.disabled"
                          [color]="button.color"
                          (click)="songNumberService.readPresented()"
                          *ngIf="songNumberService.presentedButton$ | async as button">
            <ion-icon [name]="button.icon"></ion-icon>
          </ion-fab-button>
        </ion-fab>

        <ion-fab vertical="bottom" horizontal="end" slot="fixed"
                 *ngIf="songNumberService.presentButton$ | async as button">
          <ion-fab-button [disabled]="button.disabled"
                          [color]="button.color"
                          (click)="songNumberService.presentNumber()">
            <ion-icon [name]="button.icon"></ion-icon>
          </ion-fab-button>
        </ion-fab>
      </ion-content>
    </ng-container>
  `,
  styles: [`
    ion-header {
      ion-fab-button {
        margin-right: 8px;
        padding: 2px;
      }
    }
  `]
})
export class MainPageComponent implements OnDestroy {

  i18n = this.i18nService.instant([
    'pages.main.currentlyPresenting',
    'pages.main.close',
    'pages.main.empty',
  ])
  subscription = this.songNumberService.message$.pipe(
    filter(data => data.isFeedback),
    map(data => {
      const {thumb} = data.book || {};
      let image = '';
      if (thumb) {
        image = thumb.match(/\((.*?)\)/)[1].replace(/('|")/g, '');
        image = `<img src="${image}">`;
      }
      const notes = data.notes && `<ion-card-content>${data.notes}</ion-card-content>` || '';
      switch (data.type) {
        case 1: {
          return `
                ${image}
                <ion-card-header>
                <ion-card-title>${data.number} ${data.book.title}</ion-card-title>
                <ion-card-subtitle>${data.book.description}</ion-card-subtitle>
                </ion-card-header>
                ${notes}
            `;
        }
        case 2: {
          return data.message;
        }
        default: {
          return this.i18n['pages.main.empty'];
        }
      }
    }),
    switchMap(data => from(this.alertCtrl.create({
      cssClass: 'info-modal',
      message: data,
      buttons: [this.i18n['pages.main.close']]
    })))
  ).subscribe(feedbackMessage => feedbackMessage.present());

  constructor(private i18nService: TranslateService,
              public songNumberService: SongNumberService,
              private songBooksService: SongBooksService,
              private modalCtrl: ModalController,
              private alertCtrl: AlertController) {
  }

  get book() {
    return this.songNumberService.book.model;
  }

  set book(book) {
    this.songNumberService.book.model = book
  }

  get collections() {
    return this.songBooksService.collections.model
  }

  async openSelectBookModal() {
    const modal = await this.modalCtrl.create({
      component: SelectBookModalComponent,
      componentProps: {
        collections: this.collections,
        book: this.book
      }
    });
    await modal.present();
    const {data} = await modal.onDidDismiss();
    if (data) {
      this.book = data
    }
  }

  ngOnDestroy() {
    this.subscription?.unsubscribe()
  }
}
