import {Component} from '@angular/core';
import {ModalController} from 'ionic-angular';
import {SongNumberService} from  '../../providers/song-number';
import {ChromecastService} from '../../providers/chromecast';
import {SelectBookModalPage} from '../select-book-modal/select-book-modal';

interface PresentButton {
  isPresenting: boolean, text: string, color: string
}

@Component({
  selector: 'page-main',
  templateUrl: 'main.html'
})
export class MainPage {

  presentButtonOFF: PresentButton = {
    isPresenting: false,
    text: 'Present',
    color: 'primary'
  };

  presentButtonON: PresentButton = {
    isPresenting: true,
    text: 'Stop',
    color: 'danger'
  };

  presentButton: PresentButton = this.presentButtonOFF;

  constructor(public songNumberService: SongNumberService, public chromecastService: ChromecastService, public modalCtrl: ModalController) {
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
      let toPresent = this.songNumberService.presentNumber();
      console.log(toPresent);
      this.chromecastService.send(toPresent);
      this.presentButton = this.presentButtonON;
    } else {
      this.chromecastService.stop();
      this.presentButton = this.presentButtonOFF;
    }
  }
}
