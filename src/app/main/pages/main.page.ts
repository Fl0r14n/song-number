import {Component, OnInit} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {AlertController, ModalController} from '@ionic/angular';
import {SelectBookModalComponent} from '../components/select-book-modal/select-book-modal.component';
import {CastPage} from '../../shared/abstract/cast-page';
import {ChromeCastService} from '../../shared/services/chrome-cast.service';
import {SongNumberService} from '../../shared/services/song-number.service';

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

  get digits() {
    return this.songNumberService.digits;
  }

  set notes(notes) {
    this.songNumberService.notes = notes;
  }

  get notes() {
    return this.songNumberService.notes;
  }

  get book() {
    return this.songNumberService.book;
  }

  async openSelectBookModal() {
    const modal = await this.modalCtrl.create({
      component: SelectBookModalComponent,
      componentProps: {
        collections: this.songNumberService.collections,
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

  readPresented() {
    this.songNumberService.readPresented();
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
