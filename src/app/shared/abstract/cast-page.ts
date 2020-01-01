import {ChromeCastService, ChromeCastState} from '../services/chrome-cast.service';
import {tap} from 'rxjs/operators';

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

  protected constructor(protected chromeCastService: ChromeCastService) {
  }

  get chromeCastState$() {
    return this.chromeCastService.stateChanged$;
  }

  public isDisabled(state: ChromeCastState): boolean {
    return state === ChromeCastState.DISABLED;
  }

  public isInitialized(state: ChromeCastState): boolean {
    // tslint:disable-next-line:no-bitwise
    return (state & ChromeCastState.INITIALIZED) === ChromeCastState.INITIALIZED;
  }

  public isAvailable(state: ChromeCastState): boolean {
    // tslint:disable-next-line:no-bitwise
    return (state & ChromeCastState.AVAILABLE) === ChromeCastState.AVAILABLE;
  }

  public isConnected(state: ChromeCastState): boolean {
    // tslint:disable-next-line:no-bitwise
    return (state & ChromeCastState.CONNECTED) === ChromeCastState.CONNECTED;
  }

  public get button(): CastButton {
    return CastPage.presentButton;
  }

  cast(state: ChromeCastState) {
    if (this.isConnected(state)) {
      CastPage.presentButton = CastPage.presentButtonOFF;
      this.chromeCastService.close();
    } else {
      this.chromeCastService.open();
    }
  }

  abstract present();
}
