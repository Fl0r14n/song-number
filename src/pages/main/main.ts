import {Component} from '@angular/core';
import {ModalController} from 'ionic-angular';
import {SongNumberService} from  '../../providers/song-number';
import {SelectBookModalPage} from '../select-book-modal/select-book-modal';
import {ChromecastService} from "../../providers/chromecast";

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

  constructor(public songNumberService: SongNumberService, public modalCtrl: ModalController, public chromecastService: ChromecastService) {
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
