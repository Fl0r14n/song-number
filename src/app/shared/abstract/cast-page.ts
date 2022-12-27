import {ChromeCastService, ChromeCastState} from '../services/chrome-cast.service';

export interface CastButton {
  icon: string;
  color: string;
}

export abstract class CastPage {

  chromeCastState$ = this.chromeCastService.stateChanged$

  protected static presentButtonOFF: CastButton = {
    icon: 'play',
    color: 'primary'
  };
  protected static presentButtonON: CastButton = {
    icon: 'square',
    color: 'danger'
  };
  protected static presentButton = CastPage.presentButtonOFF;
  protected i18n: Record<string, any> = {};

  protected constructor(protected chromeCastService: ChromeCastService) {
  }

  isDisabled(state: ChromeCastState) {
    return state === ChromeCastState.DISABLED;
  }

  isInitialized(state: ChromeCastState) {
    return (state & ChromeCastState.INITIALIZED) === ChromeCastState.INITIALIZED;
  }

  isAvailable(state: ChromeCastState) {
    return (state & ChromeCastState.AVAILABLE) === ChromeCastState.AVAILABLE;
  }

  isConnected(state: ChromeCastState) {
    return (state & ChromeCastState.CONNECTED) === ChromeCastState.CONNECTED;
  }

  get button() {
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

  abstract present(): void;
}
