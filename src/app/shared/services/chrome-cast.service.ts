import {Injectable, NgZone} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {ReplaySubject} from 'rxjs';
import {LoggerService} from './logger.service';

declare global {

  interface Window {
    chrome?: {
      cast?: any

      [key: string]: any
    }
  }
}

export enum ChromeCastState {
  DISABLED = 0,
  INITIALIZED = 1,
  AVAILABLE = 3,
  CONNECTED = 7
}

const APPLICATION_ID = '20CAA3A2';
const NAMESPACE = 'urn:x-cast:ro.biserica2.cast.songnumber';

@Injectable({
  providedIn: 'root'
})
export class ChromeCastService {

  #i18n: Record<string, any> = {};
  #cast: any;
  #session: any;

  #state = ChromeCastState.DISABLED;
  stateChanged$ = new ReplaySubject<ChromeCastState>(1);
  messageListener$ = new ReplaySubject<any>(1);

  constructor(protected i18nService: TranslateService,
              protected log: LoggerService,
              protected zone: NgZone) {
    this.i18nService.get([
      'providers.chromecast.session',
      'providers.chromecast.newSession',
      'providers.chromecast.sessionUpdated',
      'providers.chromecast.sessionRemoved',
      'providers.chromecast.messageReceived',
      'providers.chromecast.sendMessage',
      'providers.chromecast.receiverFound',
      'providers.chromecast.receiverNotFound',
      'providers.chromecast.error',
      'providers.chromecast.success',
      'providers.chromecast.stop'
    ]).subscribe(value => {
      this.#i18n = value;
      // decouple
      setTimeout(() => {
        // now initialize chromecast
        this.loadScript();
      }, 1000);
    });
  }


  init = () => {
    this.#cast = window.chrome?.cast;
    if (this.#cast) {
      const apiConfig = new this.#cast.ApiConfig(new this.#cast.SessionRequest(APPLICATION_ID), this.onSession, (status: any) => {
        switch (status) {
          case this.#cast.ReceiverAvailability.UNAVAILABLE: {
            this.setState(ChromeCastState.INITIALIZED);
            // close session if existed
            this.close(ChromeCastState.INITIALIZED);
            this.log.warn(this.#i18n['providers.chromecast.receiverNotFound']);
            break;
          }
          case this.#cast.ReceiverAvailability.AVAILABLE: {
            if (!this.#session) {
              this.setState(ChromeCastState.AVAILABLE);
            }
            this.log.debug(this.#i18n['providers.chromecast.receiverFound']);
            break;
          }
          default: {
            this.setState(ChromeCastState.DISABLED);
          }
        }
      });
      this.#cast.initialize(apiConfig, () => {
        this.setState(ChromeCastState.INITIALIZED);
      }, this.onError);
    }
  };

  open = () => {
    if (this.#state === ChromeCastState.AVAILABLE) {
      this.#cast.requestSession(this.onSession);
    } else {
      if (this.#state === ChromeCastState.INITIALIZED) {
        // force init since it might not get it the first time
        this.init();
      }
    }
  };

  close = (state?: ChromeCastState) => {
    if (this.#session) {
      this.#session.stop(() => {
        this.setState(state ? state : ChromeCastState.AVAILABLE);
        this.log.debug(this.#i18n['providers.chromecast.stop']);
        this.#session = undefined;
      }, this.onError);
    }
  };

  send = (msg: any) => {
    if (this.#session) {
      this.#session.sendMessage(NAMESPACE, msg, this.onSendSuccess, this.onError);
    }
  };

  private setState = (state: ChromeCastState) => {
    this.#state = state;
    this.zone.run(() => this.stateChanged$.next(state));
  };

  private loadScript = () => {
    this.#cast = window.chrome?.cast;
    if (this.#cast) {
      this.init();
    } else {
      // inject script if in browser mode
      const head = document.getElementsByTagName('head')[0];
      const script = document.createElement('script');
      script.type = 'text/javascript';
      script.src = 'https://www.gstatic.com/cv/js/sender/v1/cast_sender.js';
      script.onload = this.onLoadCastApi;
      head.appendChild(script);
    }
  };

  private onLoadCastApi = () => {
    this.#cast = window.chrome?.cast;
    if (this.#cast) {
      this.init();
    } else {
      // might not be injected in page
      setTimeout(this.init, 1000);
    }
  };

  private onSession = (session: any) => {
    this.setState(ChromeCastState.CONNECTED);
    this.#session = session;
    this.log.debug(this.#i18n['providers.chromecast.newSession'] + this.#session.sessionId);
    this.#session.addUpdateListener((isAlive: boolean) => {
      if (this.#session) {
        let message = isAlive ? this.#i18n['providers.chromecast.sessionUpdated'] : this.#i18n['providers.chromecast.sessionRemoved'];
        message += ': ' + this.#session.sessionId;
        this.log.debug(message);
        if (!isAlive) {
          this.close();
        }
      }
    });
    this.#session.addMessageListener(NAMESPACE, (namespace: string, message: any) => {
      // message received
      this.log.debug(this.#i18n['providers.chromecast.messageReceived'] + message);
      this.messageListener$.next(JSON.parse(message));
    });
  };

  private onError = (err: any) => {
    this.log.error(this.#i18n['providers.chromecast.error'] + JSON.stringify(err));
  };

  private onSendSuccess = (msg: any) => {
    this.log.debug(this.#i18n['providers.chromecast.sendMessage'] + JSON.stringify(msg));
  };
}
