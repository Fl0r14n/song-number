import {Component} from '@angular/core';
import {AlertController, ModalController} from 'ionic-angular';
import {SongNumberService} from '../../providers/song-number';
import {AddBookModalPage} from '../add-book-modal/add-book-modal';
import {LoggerService} from "../../providers/logger";

@Component({
  selector: 'page-config',
  templateUrl: 'config.html'
})
export class ConfigPage {

  possibleDigits: number[] = [1, 2, 3, 4, 5];

  constructor(public songNumberService: SongNumberService,
              public alertCtrl: AlertController,
              public modalCtrl: ModalController,
              public log: LoggerService) {
  }

  get digitLength(): number {
    return this.songNumberService.digits.length;
  }

  set digitLength(value: number) {
    this.songNumberService.changeDigitLength(value);
  }

  removeBook(item) {
    let confirm = this.alertCtrl.create({
      title: 'Remove ' + item.title + '?',
      message: 'This operation cannot be undone',
      buttons: [
        {
          text: 'Cancel',
          handler: () => {
          }
        },
        {
          text: 'Remove',
          handler: () => {
            let idx = this.songNumberService.books.indexOf(item);
            this.songNumberService.books.splice(idx, 1);
          }
        }
      ]
    });
    confirm.present();
  }

  openAddBookModal() {
    let modal = this.modalCtrl.create(AddBookModalPage);
    modal.onDidDismiss(data => {
      if (data) {
        this.songNumberService.books.push(data);
        this.songNumberService.book = data;
      }
    });
    modal.present();
  }

  get debug(): boolean {
    return this.log.logLevel == LoggerService.DEBUG;
  }

  set debug(value: boolean) {
    this.log.logLevel = value ? LoggerService.DEBUG : LoggerService.ERROR;
  }
}
