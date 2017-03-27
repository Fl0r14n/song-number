import {AfterViewInit, Component} from '@angular/core';
import {ModalController} from 'ionic-angular';
import {SongNumberService} from  '../../providers/song-number';
import {SelectBookModalPage} from '../select-book-modal/select-book-modal';
import {ChromecastService} from '../../providers/chromecast';
import {TranslateService} from 'ng2-translate';
import {CastPage} from '../cast-page';

@Component({
  selector: 'page-main',
  templateUrl: 'main.html'
})
export class MainPage extends CastPage implements AfterViewInit {

  constructor(i18nService: TranslateService, protected songNumberService: SongNumberService, protected modalCtrl: ModalController, protected chromecastService: ChromecastService) {
    super(i18nService, chromecastService);
    i18nService.get(['pages.main.startPresenting', 'pages.main.stopPresenting']).subscribe((value) => {
      this.i18n = value;
      this.presentButtonON.text = this.i18n['pages.main.stopPresenting'];
      this.presentButtonOFF.text = this.i18n['pages.main.startPresenting'];
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
