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
  protected i18n: Record<string, any> = {};

  protected constructor(protected chromeCastService: ChromeCastService) {
  }

  get chromeCastState$() {
    return this.chromeCastService.stateChanged$;
  }

  isDisabled(state: ChromeCastState): boolean {
    return state === ChromeCastState.DISABLED;
  }

  isInitialized(state: ChromeCastState): boolean {
    return (state & ChromeCastState.INITIALIZED) === ChromeCastState.INITIALIZED;
  }

  isAvailable(state: ChromeCastState): boolean {
    return (state & ChromeCastState.AVAILABLE) === ChromeCastState.AVAILABLE;
  }

  isConnected(state: ChromeCastState): boolean {
    return (state & ChromeCastState.CONNECTED) === ChromeCastState.CONNECTED;
  }

  get button(): CastButton {
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
