import {Component} from '@angular/core';
import {ModalController} from 'ionic-angular';
import {SongNumberService} from  '../../providers/song-number';
import {ChromecastService} from '../../providers/chromecast';
import {SelectBookModalPage} from '../select-book-modal/select-book-modal';

@Component({
  selector: 'page-main',
  templateUrl: 'main.html'
})
export class MainPage {

  connectSdk: any;
  discoveryManager: any;
  devices: any;

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

  searchDevices() {
    this.chromecastService.initialize();
  }

  showNumber() {
    this.chromecastService.send('Hello World');
  }
}
