import {TranslateService} from '@ngx-translate/core';
import {ChromecastService, ChromecastState} from '../providers/chromecast.service';

export interface CastButton {
  text: string,
  color: string
}

export abstract class CastPage {

  protected presentButtonOFF: CastButton;
  protected presentButtonON: CastButton;
  protected presentButton: CastButton;
  protected i18n: any[];
  protected state: ChromecastState = ChromecastState.DISABLED;

  constructor(protected i18nService: TranslateService,
              protected chromecastService: ChromecastService) {
    this.i18nService.get(['pages.cast.stopPresenting', 'pages.cast.startPresenting']).subscribe((value) => {
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
    this.state = chromecastService.state;
    this.chromecastService.stateChanged.subscribe((state) => {
      this.state = state;
    });
  }

  public get disabled(): boolean {
    return this.state === ChromecastState.DISABLED;
  }

  public get initialized(): boolean {
    return (this.state & ChromecastState.INITIALIZED) === ChromecastState.INITIALIZED;
  }

  public get available(): boolean {
    return (this.state & ChromecastState.AVAILABLE) === ChromecastState.AVAILABLE;
  }

  public get connected(): boolean {
    return (this.state & ChromecastState.CONNECTED) === ChromecastState.CONNECTED;
  }

  cast() {
    if (this.connected) {
      this.presentButton = this.presentButtonOFF;
      this.chromecastService.close();
    } else {
      this.chromecastService.open();
    }
  }

  abstract present();
}
