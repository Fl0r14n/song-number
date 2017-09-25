import {AfterViewInit, Component} from '@angular/core';
import {AlertController, ModalController} from 'ionic-angular';
import {CastButton, CastPage} from '../cast-page';
import {SongNumberService} from '../../providers/song-number.service';
import {ChromecastService} from '../../providers/chromecast.service';
import {SelectBookModalPage} from '../select-book-modal/select-book-modal.page';
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'page-main',
  templateUrl: 'main.page.html'
})
export class MainPage extends CastPage implements AfterViewInit {

  protected queryStateButton: CastButton;

  constructor(i18nService: TranslateService,
              chromecastService: ChromecastService,
              protected songNumberService: SongNumberService,
              protected modalCtrl: ModalController,
              protected alertCtrl: AlertController) {
    super(i18nService, chromecastService);
    i18nService.get([
      'pages.main.startPresenting',
      'pages.main.stopPresenting',
      'pages.main.currentlyPresenting',
      'pages.main.close',
      'pages.main.empty',
      'pages.main.queryState'
    ]).subscribe((value) => {
      this.i18n = value;
      this.presentButtonON.text = this.i18n['pages.main.stopPresenting'];
      this.presentButtonOFF.text = this.i18n['pages.main.startPresenting'];
      this.queryStateButton = {
        text: this.i18n['pages.main.queryState'],
        color: 'primary'
      }
    });
    chromecastService.messageListener.subscribe(data => {
      if (data.isFeedback) {
        let subTitle = '';
        switch (data.type) {
          case 1: {
            subTitle = [
              data.number,
              ' ',
              data.book.title,
              '<br>',
              data.book.description,
              '<br>',
              data.notes
            ].join('');
            break;
          }
          case 2: {
            subTitle = data.message;
            break;
          }
          default: {
            subTitle = this.i18n['pages.main.empty'];
          }
        }
        let feedbackMessage = alertCtrl.create({
          title: this.i18n['pages.main.currentlyPresenting'],
          subTitle: subTitle,
          buttons: [this.i18n['pages.main.close']]
        });
        feedbackMessage.present();
      }
    });
  }

  openSelectBookModal() {
    let modal = this.modalCtrl.create(SelectBookModalPage, {
      books: this.songNumberService.books,
      book: this.songNumberService.book
    });
    modal.onDidDismiss(data => {
      this.songNumberService.book = data;
    });
    modal.present();
  }

  present() {
    if (!this.songNumberService.isPresenting) {
      this.songNumberService.presentNumber();
      this.presentButton = this.presentButtonON;
    } else {
      this.songNumberService.stopPresentaion();
      this.presentButton = this.presentButtonOFF;
    }
  }

  ngAfterViewInit(): void {
    // reinitialize button state
    if (this.songNumberService.isPresenting) {
      this.presentButton = this.presentButtonON;
    } else {
      this.presentButton = this.presentButtonOFF;
    }
  }
}
