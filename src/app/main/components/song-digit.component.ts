import {Component, Input, Output, EventEmitter} from '@angular/core';

@Component({
  selector: 'song-digit',
  template: `
    <div class="ion-text-center">
      <ion-button fill="outline" (click)="inc()">
        <ion-icon name="chevron-up-outline"></ion-icon>
      </ion-button>
      <div class="ion-padding">
        <ion-label class="ion-text-center">
          {{digit}}
        </ion-label>
      </div>
      <ion-button fill="outline" (click)="dec()">
        <ion-icon name="chevron-down-outline"></ion-icon>
      </ion-button>
    </div>
  `
})
export class SongDigitComponent {

  @Input()
  digit = 0;
  @Output()
  digitChange = new EventEmitter<number>();

  inc() {
    this.change(+1);
  }

  dec() {
    this.change(-1);
  }

  change(value: number) {
    this.digit += value;
    if (this.digit < 0) {
      this.digit = 9;
    } else if (this.digit > 9) {
      this.digit = 0;
    }
    this.digitChange.emit(this.digit);
  }
}
