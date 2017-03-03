import {Component} from '@angular/core';
import {SongNumberService} from  '../../providers/song-number';
import {ChromecastService} from "../../providers/chromecast";
import {TranslateService} from "ng2-translate";

interface PresentButton {
  isPresenting: boolean, text: string, color: string
}

@Component({
  selector: 'page-info',
  templateUrl: 'info.html'
})
export class InfoPage {

  i18n: any[];
  presentButtonOFF: PresentButton;
  presentButtonON: PresentButton;
  presentButton: PresentButton;

  constructor(i18nService: TranslateService, public songNumberService: SongNumberService, public chromecastService: ChromecastService) {
    i18nService.get(['pages.info.startPresenting', 'pages.info.stopPresenting']).subscribe((value) => {
      this.i18n = value;
      this.presentButtonON = {
        isPresenting: true,
        text: this.i18n['pages.info.stopPresenting'],
        color: 'danger'
      };
      this.presentButtonOFF = {
        isPresenting: false,
        text: this.i18n['pages.info.startPresenting'],
        color: 'primary'
      };
      this.presentButton = this.presentButtonOFF;
    });
  }

  cast() {
    this.chromecastService.isConnected() ? this.chromecastService.close() : this.chromecastService.open();
  }

  present() {
    if (!this.presentButton.isPresenting) {
      this.songNumberService.presentInfo();
      this.presentButton = this.presentButtonON;
    } else {
      this.songNumberService.stopPresentaion();
      this.presentButton = this.presentButtonOFF;
    }
  }
}
