import {Component} from '@angular/core';
import {SongNumberService} from '../../shared/services';

@Component({
  selector: 'info-page',
  template: `
    <ng-container>
      <ion-header>
        <ion-toolbar>
          <ion-title>
            <ion-icon name="information-circle"></ion-icon>
            {{ 'pages.info.title' | translate}}
          </ion-title>
          <ion-fab-button slot="end"
                          [disabled]="button.disabled"
                          [color]="button.color"
                          (click)="songNumberService.cast()"
                          *ngIf="songNumberService.castButton$ | async as button">
            <img [src]="button.icon" alt="cast-icon">
          </ion-fab-button>
        </ion-toolbar>
      </ion-header>

      <ion-content class="ion-padding">
        <ion-item>
          <ion-textarea clearInput
                        rows="6"
                        [placeholder]="'pages.info.textArea' | translate"
                        [(ngModel)]="songNumberService.info.model"></ion-textarea>
        </ion-item>

        <ion-fab vertical="bottom" horizontal="start" slot="fixed">
          <ion-fab-button [disabled]="button.disabled"
                          [color]="button.color"
                          (click)="songNumberService.readPresented()"
                          *ngIf="songNumberService.presentedButton$ | async as button">
            <ion-icon [name]="button.icon"></ion-icon>
          </ion-fab-button>
        </ion-fab>

        <ion-fab vertical="bottom" horizontal="end" slot="fixed"
                 *ngIf="songNumberService.presentButton$ | async as button">
          <ion-fab-button [disabled]="button.disabled"
                          [color]="button.color"
                          (click)="songNumberService.presentInfo()">
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
export class InfoPageComponent {

  constructor(public songNumberService: SongNumberService) {
  }
}
