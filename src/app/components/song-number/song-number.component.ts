import {Component, Input} from '@angular/core';

@Component({
  selector: 'song-number',
  templateUrl: 'song-number.component.html',
  styleUrls: ['song-number.component.scss']
})
export class SongNumberComponent {

  @Input()
  value: any[];
}
