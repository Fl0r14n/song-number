import {Component, Input} from '@angular/core';

@Component({
  selector: 'song-number',
  templateUrl: 'song-number.component.html',
})
export class SongNumberComponent {

  @Input()
  value: any[];
}
