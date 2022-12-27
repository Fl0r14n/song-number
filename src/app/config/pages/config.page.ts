import {Component} from '@angular/core';
import {Router} from '@angular/router';
import {ModalController} from '@ionic/angular';
import {LoggerService, LogLevel, SongBooksService, SongNumberService} from '../../shared/services';
import {ImportModalComponent} from '../components/import-modal.component';

@Component({
  selector: 'config-page',
  template: `
    <ion-header>
      <ion-toolbar>
        <ion-title>
          <ion-icon name="settings"></ion-icon>
          {{'pages.config.title' | translate}}
        </ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">
      <ion-item-group>
        <ion-item-divider>
          <ion-label>{{'pages.config.title' | translate}}</ion-label>
        </ion-item-divider>

        <ion-item>
          <ion-label>{{'pages.config.debug' | translate}}</ion-label>
          <ion-toggle [(ngModel)]="debug"></ion-toggle>
        </ion-item>

        <ion-item>
          <ion-label>{{'pages.config.digits' | translate}}</ion-label>
          <ion-select [(ngModel)]="digitLength">
            <ion-select-option *ngFor="let value of possibleDigits">{{value}}</ion-select-option>
          </ion-select>
        </ion-item>

        <ion-item>
          <ion-label position="floating">{{'pages.config.collections' | translate}}</ion-label>
          <ion-input [(ngModel)]="songBooksService.endpoint.model"></ion-input>
        </ion-item>

        <ion-fab vertical="bottom" horizontal="end" slot="fixed">
          <ion-fab-button (click)="importCollection()">
            <ion-icon name="add"></ion-icon>
          </ion-fab-button>
        </ion-fab>
      </ion-item-group>
    </ion-content>
  `
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
    return this.songNumberService.digits.model.length;
  }

  set digitLength(value: number) {
    this.songNumberService.changeDigitLength(value).then();
  }

  get debug(): boolean {
    return this.log.logLevel.model === LogLevel.DEBUG;
  }

  set debug(value: boolean) {
    this.log.logLevel.model = value && LogLevel.DEBUG || LogLevel.INFO;
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
