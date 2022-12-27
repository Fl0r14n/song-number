import {Component} from '@angular/core';
import {CastPage} from '../../shared/pages';
import {ChromeCastService, SongNumberService} from '../../shared/services';

@Component({
  selector: 'info-page',
  template: `
    <ng-container *ngIf="chromeCastState$ | async as state">
      <ion-header>
        <ion-toolbar>
          <ion-title>
            <ion-icon name="information-circle"></ion-icon>
            {{ 'pages.info.title' | translate}}
          </ion-title>
          <ion-fab-button slot="end"
                          [disabled]="!isInitialized(state)"
                          [color]="isConnected(state) ? 'secondary' : 'primary'"
                          (click)="cast(state)">
            <img src="assets/icon/cast-icon.svg" alt="cast-icon">
          </ion-fab-button>
        </ion-toolbar>
      </ion-header>

      <ion-content class="ion-padding">
        <ion-item>
          <ion-textarea placeholder="{{ 'pages.info.textArea' | translate}}" clearInput rows="6"
                        [(ngModel)]="info"></ion-textarea>
        </ion-item>

        <ion-fab vertical="bottom" horizontal="end" slot="fixed">
          <ion-fab-button [disabled]="!isConnected(state)"
                          [color]="button.color"
                          (click)="present()">
            <ion-icon [name]="button.icon"></ion-icon>
          </ion-fab-button>
        </ion-fab>
      </ion-content>
    </ng-container>
  `,
  styles: [`
    ion-header {
    ion-fab-button {
      margin-right: 8px;
      padding: 2px;
    }
    }
  `]
})
export class InfoPageComponent extends CastPage {

  constructor(chromeCastService: ChromeCastService,
              private songNumberService: SongNumberService) {
    super(chromeCastService);
  }

  get info() {
    return this.songNumberService.info.model;
  }

  set info(info) {
    this.songNumberService.info.model = info;
  }

  present() {
    if (!this.songNumberService.isPresenting) {
      this.songNumberService.presentInfo();
      CastPage.presentButton = CastPage.presentButtonON;
    } else {
      this.songNumberService.stopPresentation();
      CastPage.presentButton = CastPage.presentButtonOFF;
    }
  }
}
