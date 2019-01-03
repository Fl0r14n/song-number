import {ChromeCastService, ChromeCastState} from '../services/chrome-cast.service';

export interface CastButton {
  icon: string;
  color: string;
}

export abstract class CastPage {

  protected static presentButtonOFF: CastButton = {
    icon: 'play',
    color: 'primary'
  };
  protected static presentButtonON: CastButton = {
    icon: 'square',
    color: 'danger'
  };
  protected static presentButton: CastButton = CastPage.presentButtonOFF;
  protected i18n: any[];
  protected state: ChromeCastState = ChromeCastState.DISABLED;

  protected constructor(protected chromeCastService: ChromeCastService) {
    this.state = chromeCastService.state;
    this.chromeCastService.stateChanged.subscribe((state) => {
      this.state = state;
    });
  }

  public get disabled(): boolean {
    return this.state === ChromeCastState.DISABLED;
  }

  public get initialized(): boolean {
    return (this.state & ChromeCastState.INITIALIZED) === ChromeCastState.INITIALIZED;
  }

  public get available(): boolean {
    return (this.state & ChromeCastState.AVAILABLE) === ChromeCastState.AVAILABLE;
  }

  public get connected(): boolean {
    return (this.state & ChromeCastState.CONNECTED) === ChromeCastState.CONNECTED;
  }

  public get button(): CastButton {
    return CastPage.presentButton;
  }

  cast() {
    if (this.connected) {
      CastPage.presentButton = CastPage.presentButtonOFF;
      this.chromeCastService.close();
    } else {
      this.chromeCastService.open();
    }
  }

  abstract present();
}
