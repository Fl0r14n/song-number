import {TranslateService} from 'ng2-translate';
import {ChromecastService} from '../providers/chromecast.service';

export interface CastButton {
  text: string, color: string
}

export abstract class CastPage {

  protected presentButtonOFF: CastButton;
  protected presentButtonON: CastButton;
  protected presentButton: CastButton;
  protected i18n: any[];

  constructor(i18nService: TranslateService,
              protected chromecastService: ChromecastService) {
    i18nService.get(['pages.cast.stopPresenting', 'pages.cast.startPresenting']).subscribe((value) => {
      this.i18n = value;
      this.presentButtonON = {
        text: this.i18n['pages.cast.stopPresenting'],
        color: 'danger'
      };
      this.presentButtonOFF = {
        text: this.i18n['pages.cast.startPresenting'],
        color: 'primary'
      };
      this.presentButton = this.presentButtonOFF;
    });
  }

  cast() {
    if (this.chromecastService.isConnected()) {
      this.presentButton = this.presentButtonOFF;
      this.chromecastService.close();
    } else {
      this.chromecastService.open();
    }
  }

  abstract present();
}
