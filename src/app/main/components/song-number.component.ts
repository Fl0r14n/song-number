import {Component, Input} from '@angular/core';
import {Digit} from '../../shared/models';

@Component({
  selector: 'song-number',
  template: `
    <ion-row>
      <ion-col *ngFor="let digit of digits">
        <song-digit [(digit)]="digit.value"></song-digit>
      </ion-col>
    </ion-row>
  `
})
export class SongNumberComponent {

  @Input()
  digits: Digit[] | undefined;
}
