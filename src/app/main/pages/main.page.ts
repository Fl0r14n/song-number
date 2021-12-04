import {Component, OnInit} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {AlertController, ModalController} from '@ionic/angular';
import {SelectBookModalComponent} from '../components/select-book-modal/select-book-modal.component';
import {CastPage} from '../../shared/abstract/cast-page';
import {ChromeCastService} from '../../shared/services/chrome-cast.service';
import {SongNumberService} from '../../shared/services/song-number.service';
import {filter, map, switchMap} from 'rxjs/operators';
import {from} from 'rxjs';
import {SongBooksService} from '../../shared/services/song-books.service';

@Component({
  selector: 'main-page',
  templateUrl: 'main.page.html',
  styleUrls: ['main.page.scss']
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
    return this.songNumberService.digits;
  }

  set notes(notes) {
    this.songNumberService.notes = notes;
  }

  get notes() {
    return this.songNumberService.notes;
  }

  get book() {
    return this.songNumberService.book;
  }

  async openSelectBookModal() {
    const modal = await this.modalCtrl.create({
      component: SelectBookModalComponent,
      componentProps: {
        collections: this.songBooksService.collections,
        book: this.songNumberService.book
      }
    });
    await modal.present();
    const {data} = await modal.onDidDismiss();
    this.songNumberService.book = data || this.songNumberService.book;
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

  ngOnInit(): void {
    this.i18nService.get([
      'pages.main.currentlyPresenting',
      'pages.main.close',
      'pages.main.empty',
    ]).subscribe((value) => {
      this.i18n = value;
    });
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
