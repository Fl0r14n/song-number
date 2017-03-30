import {AfterViewInit, Component} from '@angular/core';
import {AlertController, ModalController} from 'ionic-angular';
import {SongNumberService} from  '../../providers/song-number';
import {SelectBookModalPage} from '../select-book-modal/select-book-modal';
import {ChromecastService} from '../../providers/chromecast';
import {TranslateService} from 'ng2-translate';
import {CastButton, CastPage} from '../cast-page';

@Component({
  selector: 'page-main',
  templateUrl: 'main.html'
})
export class MainPage extends CastPage implements AfterViewInit {

  protected queryStateButton: CastButton;

  constructor(i18nService: TranslateService,
              protected songNumberService: SongNumberService,
              protected modalCtrl: ModalController,
              protected chromecastService: ChromecastService,
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
      if(data.isFeedback) {
        let subTitle = '';
        switch(data.type) {
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
    // reinit button state
    if (this.songNumberService.isPresenting) {
      this.presentButton = this.presentButtonON;
    } else {
      this.presentButton = this.presentButtonOFF;
    }
  }
}
