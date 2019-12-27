import {AfterViewInit, Component, OnInit} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {CastPage} from '../cast-page';
import {ChromeCastService} from '../../services/chrome-cast.service';
import {SongNumberService} from '../../services/song-number.service';
import {AlertController, ModalController} from '@ionic/angular';
import {SelectBookModalPageComponent} from '../select-book-modal/select-book-modal.page';

@Component({
  selector: 'main-page',
  templateUrl: 'main.page.html',
  styleUrls: ['main.page.scss']
})
export class MainPageComponent extends CastPage implements OnInit {

  constructor(chromeCastService: ChromeCastService,
              private i18nService: TranslateService,
              private songNumberService: SongNumberService,
              private modalCtrl: ModalController,
              private alertCtrl: AlertController) {
    super(chromeCastService);
  }

  async openSelectBookModal() {
    const modal = await this.modalCtrl.create({
      component: SelectBookModalPageComponent,
      componentProps: {
        books: this.songNumberService.books,
        book: this.songNumberService.book
      }
    });
    await modal.present();
    const {data} = await modal.onDidDismiss();
    this.songNumberService.book = data || this.songNumberService.book;
  }

  present() {
    if (!this.songNumberService.isPresenting) {
      this.songNumberService.presentNumber();
      CastPage.presentButton = CastPage.presentButtonON;
    } else {
      this.songNumberService.stopPresentation();
      CastPage.presentButton = CastPage.presentButtonOFF;
    }
  }

  ngOnInit(): void {
    this.i18nService.get([
      'pages.main.currentlyPresenting',
      'pages.main.close',
      'pages.main.empty',
    ]).subscribe((value) => {
      this.i18n = value;
    });
    this.chromeCastService.messageListener.subscribe(async data => {
      if (data.isFeedback) {
        let subTitle = '';
        switch (data.type) {
          case 1: {
            subTitle = [
              data.number,
              ' ',
              data.book.title,
              '\n',
              data.book.description,
              '\n',
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
        const feedbackMessage = await this.alertCtrl.create({
          header: this.i18n['pages.main.currentlyPresenting'],
          subHeader: subTitle,
          buttons: [this.i18n['pages.main.close']]
        });
        return await feedbackMessage.present();
      }
    });
  }
}
