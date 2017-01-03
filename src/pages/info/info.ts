import {Component} from '@angular/core';
import {SongNumberService} from  '../../providers/song-number';
import {ChromecastService} from '../../providers/chromecast';

interface PresentButton {
  isPresenting: boolean, text: string, color: string
}

@Component({
  selector: 'page-info',
  templateUrl: 'info.html'
})
export class InfoPage {

  presentButtonOFF: PresentButton = {
    isPresenting: false,
    text: 'Present',
    color: 'primary'
  };

  presentButtonON: PresentButton = {
    isPresenting: true,
    text: 'Stop',
    color: 'danger'
  };

  presentButton: PresentButton = this.presentButtonOFF;

  constructor(public songNumberService: SongNumberService, public chromecastService: ChromecastService) {
  }

  present() {
    if (!this.presentButton.isPresenting) {
      this.chromecastService.send('Hello info');
      this.presentButton = this.presentButtonON;
    } else {
      this.chromecastService.stop();
      this.presentButton = this.presentButtonOFF;
    }
  }
}
