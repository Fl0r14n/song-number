import {Component, OnInit} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {SongNumberService} from '../../services/song-number.service';
import {AlertController, ModalController} from '@ionic/angular';
import {LoggerService} from '../../services/logger.service';
import {AddBookModalPageComponent} from '../add-book-modal/add-book-modal.page';
import {Book} from '../../services/types/api';

@Component({
  selector: 'config-page',
  templateUrl: 'config.page.html',
  styleUrls: ['config.page.scss']
})
export class ConfigPageComponent implements OnInit {

  i18n: any[];
  possibleDigits: number[] = [1, 2, 3, 4, 5];

  constructor(private i18nService: TranslateService,
              protected songNumberService: SongNumberService,
              private alertCtrl: AlertController,
              private modalCtrl: ModalController,
              private log: LoggerService) {
  }

  get digitLength(): number {
    return this.songNumberService.digits.length;
  }

  set digitLength(value: number) {
    this.songNumberService.changeDigitLength(value);
  }

  removeBook(item: Book) {
    this.i18nService.get('pages.config.removeBook', {value: item.title}).subscribe(async (value) => {
      const confirm = await this.alertCtrl.create({
        header: value,
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
              const idx = this.songNumberService.books.indexOf(item);
              this.songNumberService.books.splice(idx, 1);
            }
          }
        ]
      });
      confirm.present();
    });
  }

  async openAddBookModal(item: Book) {
    const modal = await this.modalCtrl.create({
      component: AddBookModalPageComponent,
      componentProps: {
        book: item
      }
    });
    await modal.present();
    const {data} = await modal.onDidDismiss();
    if (data) {
      if (item) {

      } else {
        this.songNumberService.books.push(data);
        this.songNumberService.book = data;
      }
    }
  }

  get debug(): boolean {
    return this.log.logLevel === LoggerService.DEBUG;
  }

  set debug(value: boolean) {
    this.log.logLevel = value ? LoggerService.DEBUG : LoggerService.INFO;
  }

  ngOnInit(): void {
    this.i18nService.get([
      'pages.config.cancel',
      'pages.config.remove',
      'pages.config.permanentRemoval',
      'pages.config.removeBook'
    ]).subscribe((value) => {
      this.i18n = value;
    });
  }
}
