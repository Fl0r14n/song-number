import {Component} from '@angular/core';
import {AlertController, ModalController} from 'ionic-angular';
import {SongNumberService} from '../../providers/song-number';
import {AddBookModalPage} from '../add-book-modal/add-book-modal';

@Component({
  selector: 'page-config',
  templateUrl: 'config.html'
})
export class ConfigPage {

  digitLength: number;
  possibleDigits: number[] = [1, 2, 3, 4, 5];

  constructor(public songNumberService: SongNumberService, public alertCtrl: AlertController, public modalCtrl: ModalController) {
    this.digitLength = songNumberService.digits.length;
  }

  changeDigitLength() {
    this.songNumberService.changeDigitLength(this.digitLength);
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
      console.log(data);
    });
    modal.present();
  }
}
