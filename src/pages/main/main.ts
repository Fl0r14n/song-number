import {Component} from '@angular/core';
import {ModalController} from 'ionic-angular';
import {SongNumberService} from  '../../providers/song-number';
import {SelectBookModalPage} from '../select-book-modal/select-book-modal';
import {ChromecastService} from "../../providers/chromecast";
import {TranslateService} from "ng2-translate";

interface PresentButton {
  isPresenting: boolean, text: string, color: string
}

@Component({
  selector: 'page-main',
  templateUrl: 'main.html'
})
export class MainPage {

  i18n: any[];
  presentButtonOFF: PresentButton;
  presentButtonON: PresentButton;
  presentButton: PresentButton;

  constructor(i18nService: TranslateService, public songNumberService: SongNumberService, public modalCtrl: ModalController, public chromecastService: ChromecastService) {
    i18nService.get(['pages.main.startPresenting', 'pages.main.stopPresenting']).subscribe((value) => {
      this.i18n = value;
      this.presentButtonON = {
        isPresenting: true,
        text: this.i18n['pages.main.stopPresenting'],
        color: 'danger'
      };
      this.presentButtonOFF = {
        isPresenting: false,
        text: this.i18n['pages.main.startPresenting'],
        color: 'primary'
      };
      this.presentButton = this.presentButtonOFF;
    });
  }

  cast() {
    if(this.chromecastService.isConnected()) {
      this.presentButton = this.presentButtonOFF;
      this.chromecastService.close();
    } else {
      this.chromecastService.open();
    }
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
    if (!this.presentButton.isPresenting) {
      this.songNumberService.presentNumber();
      this.presentButton = this.presentButtonON;
    } else {
      this.songNumberService.stopPresentaion();
      this.presentButton = this.presentButtonOFF;
    }
  }
}
