import {Component} from '@angular/core';
import {SongNumberService} from  '../../providers/song-number';

@Component({
  selector: 'page-info',
  templateUrl: 'info.html'
})
export class InfoPage {

  constructor(public songNumberService: SongNumberService) {
  }
}
