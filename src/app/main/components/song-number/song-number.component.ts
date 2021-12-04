import {Component, Input} from '@angular/core';
import {Digit} from '../../../index';

@Component({
  selector: 'song-number',
  templateUrl: 'song-number.component.html',
})
export class SongNumberComponent {

  @Input()
  digits: Digit[] | undefined;
}
