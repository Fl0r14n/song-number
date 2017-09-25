import {Component} from '@angular/core';
import {AlertController, ModalController} from 'ionic-angular';
import {SongNumberService} from '../../providers/song-number.service';
import {LoggerService} from '../../providers/logger.service';
import {AddBookModalPage} from '../add-book-modal/add-book-modal.page';
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'page-config',
  templateUrl: 'config.page.html'
})
export class ConfigPage {

  i18n: any[];
  possibleDigits: number[] = [1, 2, 3, 4, 5];

  constructor(protected i18nService: TranslateService,
              protected songNumberService: SongNumberService,
              protected alertCtrl: AlertController,
              protected modalCtrl: ModalController,
              protected log: LoggerService) {
    i18nService.get([
      'pages.config.cancel',
      'pages.config.remove',
      'pages.config.permanentRemoval',
      'pages.config.removeBook'
    ]).subscribe((value) => {
      this.i18n = value;
    });
  }

  get digitLength(): number {
    return this.songNumberService.digits.length;
  }

  set digitLength(value: number) {
    this.songNumberService.changeDigitLength(value);
  }

  removeBook(item) {
    this.i18nService.get('pages.config.removeBook', {value: item.title}).subscribe((value) => {
      let confirm = this.alertCtrl.create({
        title: value,
        message: this.i18n['pages.config.permanentRemoval'],
        buttons: [
          {
            text: this.i18n['pages.config.cancel'],
            handler: () => {
            }
          },
          {
            text: this.i18n['pages.config.remove'],
            handler: () => {
              let idx = this.songNumberService.books.indexOf(item);
              this.songNumberService.books.splice(idx, 1);
            }
          }
        ]
      });
      confirm.present();
    });
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
    return this.log.logLevel === LoggerService.DEBUG;
  }

  set debug(value: boolean) {
    this.log.logLevel = value ? LoggerService.DEBUG : LoggerService.INFO;
  }
}
