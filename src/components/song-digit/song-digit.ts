import {Component, Input, Output, EventEmitter} from '@angular/core';

@Component({
  selector: 'song-digit',
  templateUrl: 'song-digit.html',
})
export class SongDigitComponent {

  @Input() value: number = 0;
  @Output() valueChange: EventEmitter<number> = new EventEmitter<number>();

  inc() {
    this.change(+1);
  }

  dec() {
    this.change(-1);
  }

  change(value: number) {
    this.value += value;
    if(this.value < 0) {
      this.value = 9;
    } else if(this.value > 9) {
      this.value = 0;
    }
    this.valueChange.emit(this.value);
  }
}
