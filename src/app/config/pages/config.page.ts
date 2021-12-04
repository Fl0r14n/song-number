import {Component} from '@angular/core';
import {SongNumberService} from '../../shared/services/song-number.service';
import {LoggerService, LogLevel} from '../../shared/services/logger.service';
import {SongBooksService} from '../../shared/services/song-books.service';
import {ModalController} from '@ionic/angular';
import {ImportModalComponent} from '../components/import-modal/import-modal.component';
import {Router} from '@angular/router';

@Component({
  selector: 'config-page',
  templateUrl: 'config.page.html'
})
export class ConfigPageComponent {

  possibleDigits: number[] = [1, 2, 3, 4, 5];

  constructor(private songNumberService: SongNumberService,
              public songBooksService: SongBooksService,
              private modalCtrl: ModalController,
              private router: Router,
              private log: LoggerService) {
  }

  get digitLength(): number {
    return this.songNumberService.digits.length;
  }

  set digitLength(value: number) {
    this.songNumberService.changeDigitLength(value).then();
  }

  get debug(): boolean {
    return this.log.logLevel === LogLevel.DEBUG;
  }

  set debug(value: boolean) {
    this.log.logLevel = value && LogLevel.DEBUG || LogLevel.INFO;
  }


  async importCollection() {
    const modal = await this.modalCtrl.create({
      component: ImportModalComponent
    });
    await modal.present();
    await modal.onDidDismiss();
    await this.router.navigateByUrl('/tabs/books');
  }
}
