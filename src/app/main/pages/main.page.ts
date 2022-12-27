import {Component, OnInit} from '@angular/core';
import {AlertController, ModalController} from '@ionic/angular';
import {TranslateService} from '@ngx-translate/core';
import {from} from 'rxjs';
import {filter, map, switchMap} from 'rxjs/operators';
import {CastPage} from '../../shared/pages';
import {ChromeCastService, SongBooksService, SongNumberService} from '../../shared/services';
import {SelectBookModalComponent} from '../components/select-book-modal.component';

@Component({
  selector: 'main-page',
  template: `
    <ng-container *ngIf="chromeCastState$ | async as state">
      <ion-header>
        <ion-toolbar>
          <ion-title>
            <ion-icon name="musical-notes"></ion-icon>
            {{ 'pages.main.title' | translate}}
          </ion-title>
          <ion-fab-button slot="end"
                          [disabled]="!isInitialized(state)"
                          [color]="isConnected(state) ? 'secondary' : 'primary'"
                          (click)="cast(state)">
            <img src="assets/icon/cast-icon.svg" alt="cast-icon">
          </ion-fab-button>
        </ion-toolbar>
      </ion-header>

      <ion-content class="ion-padding">
        <song-number [digits]="digits"></song-number>

        <ion-item class="ion-padding-start ion-padding-end">
          <ion-label position="floating">{{ 'pages.main.notes' | translate}}</ion-label>
          <ion-input type="text" [(ngModel)]="notes"></ion-input>
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
          <ion-fab-button [disabled]="!isConnected(state)"
                          color="secondary"
                          (click)="readPresented()">
            <ion-icon name="information"></ion-icon>
          </ion-fab-button>
        </ion-fab>

        <ion-fab vertical="bottom" horizontal="end" slot="fixed">
          <ion-fab-button [disabled]="!isConnected(state)"
                          [color]="button.color"
                          (click)="present()">
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
export class MainPageComponent extends CastPage implements OnInit {

  constructor(chromeCastService: ChromeCastService,
              private i18nService: TranslateService,
              private songNumberService: SongNumberService,
              private songBooksService: SongBooksService,
              private modalCtrl: ModalController,
              private alertCtrl: AlertController) {
    super(chromeCastService);
  }

  get digits() {
    return this.songNumberService.digits.model;
  }

  set notes(notes) {
    this.songNumberService.notes.model = notes;
  }

  get notes() {
    return this.songNumberService.notes.model;
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

  present() {
    if (!this.songNumberService.isPresenting) {
      this.songNumberService.presentNumber();
      CastPage.presentButton = CastPage.presentButtonON;
    } else {
      this.songNumberService.stopPresentation();
      CastPage.presentButton = CastPage.presentButtonOFF;
    }
  }

  readPresented() {
    this.songNumberService.readPresented();
  }

  ngOnInit() {
    this.i18nService.get([
      'pages.main.currentlyPresenting',
      'pages.main.close',
      'pages.main.empty',
    ]).subscribe(value => {
      this.i18n = value;
    })
    this.chromeCastService.messageListener$.pipe(
      filter(data => data.isFeedback),
      map(data => {
        const {thumb} = data.book;
        let image = '';
        if (thumb) {
          image = thumb.match(/\((.*?)\)/)[1].replace(/('|")/g, '');
          image = `<img src="${image}">`;
        }
        const notes = data.notes ? `<ion-card-content>${data.notes}</ion-card-content>` : '';

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
  }
}
