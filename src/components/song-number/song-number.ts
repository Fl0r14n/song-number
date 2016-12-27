import {Component, Input} from '@angular/core';

@Component({
  selector: 'song-number',
  templateUrl: 'song-number.html'
})
export class SongNumberComponent {
  @Input() value: any[];
}
