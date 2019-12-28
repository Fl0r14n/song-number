import {Component, Input, Output, EventEmitter} from '@angular/core';

@Component({
  selector: 'song-digit',
  templateUrl: 'song-digit.component.html',
})
export class SongDigitComponent {

  @Input()
  digit = 0;
  @Output()
  digitChange: EventEmitter<number> = new EventEmitter<number>();

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
