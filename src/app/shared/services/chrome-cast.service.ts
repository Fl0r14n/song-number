import {DOCUMENT} from '@angular/common';
import {Inject, Injectable, NgZone} from '@angular/core';
import {Platform} from '@ionic/angular';
import {TranslateService} from '@ngx-translate/core';
import {BehaviorSubject, distinctUntilChanged, ReplaySubject, shareReplay} from 'rxjs';
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
  DISABLED = 0, // no cast api
  INITIALIZED = 1, // cast api initialized
  AVAILABLE = 3, // at least one receiver on the network
  CONNECTED = 7 // connected to receiver
}

const APPLICATION_ID = '20CAA3A2';
const NAMESPACE = 'urn:x-cast:ro.biserica2.cast.songnumber';

@Injectable({
  providedIn: 'root'
})
export class ChromeCastService {
  i18n: Record<string, any> = this.i18nService.instant([
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
  ]);
  #session: any;

  #state$ = new BehaviorSubject<ChromeCastState>(ChromeCastState.DISABLED);

  get state() {
    return this.#state$.getValue()
  }

  set state(state) {
    this.zone.run(() => this.#state$.next(state));
  }

  state$ = this.#state$.pipe(
    distinctUntilChanged(),
    shareReplay(1)
  )
  message$ = new ReplaySubject<any>(1);

  constructor(protected platform: Platform,
              @Inject(DOCUMENT) document: Document,
              protected i18nService: TranslateService,
              protected log: LoggerService,
              protected zone: NgZone) {
    this.platform.ready().then(() => {
      const {cast} = window.chrome || {}
      if (!cast) {
        const script = document.createElement('script')
        script.type = 'text/javascript'
        script.src = 'https://www.gstatic.com/cv/js/sender/v1/cast_sender.js'
        script.onload = () => setTimeout(this.init, 500)
        document.head.append(script)
      } else {
        this.init()
      }
    })
  }

  init = () => {
    const {cast} = window.chrome || {}
    if (cast) {
      const {ApiConfig, SessionRequest, ReceiverAvailability, initialize} = cast
      const apiConfig = new ApiConfig(new SessionRequest(APPLICATION_ID), this.onSession, (status: any) => {
        switch (status) {
          case ReceiverAvailability.UNAVAILABLE: {
            this.state = ChromeCastState.INITIALIZED;
            // close session if existed
            this.close(ChromeCastState.INITIALIZED);
            this.log.warn(this.i18n['providers.chromecast.receiverNotFound']);
            break;
          }
          case ReceiverAvailability.AVAILABLE: {
            if (!this.#session) {
              this.state = ChromeCastState.AVAILABLE;
            }
            this.log.debug(this.i18n['providers.chromecast.receiverFound']);
            break;
          }
          default: {
            this.state = ChromeCastState.DISABLED;
          }
        }
      });
      initialize(apiConfig, () => this.state = ChromeCastState.INITIALIZED, (err: any) => {
        this.state = ChromeCastState.DISABLED
        this.log.error(this.i18n['providers.chromecast.error'] + JSON.stringify(err));
      })
    }
  };

  open = () => {
    const {cast} = window.chrome || {}
    this.state === ChromeCastState.AVAILABLE && cast.requestSession(this.onSession)
  };

  close = (state?: ChromeCastState) => {
    this.#session?.stop(() => {
      this.log.debug(this.i18n['providers.chromecast.stop'])
      this.#session = undefined;
      this.state = state || ChromeCastState.AVAILABLE
    }, (err: any) => {
      this.log.error(this.i18n['providers.chromecast.error'] + JSON.stringify(err));
      this.#session = undefined;
      this.state = state || ChromeCastState.AVAILABLE
    });
  };

  send = (msg: any) => {
    this.#session && this.#session.sendMessage(NAMESPACE, msg, (msg: any) => {
      this.log.debug(this.i18n['providers.chromecast.sendMessage'] + JSON.stringify(msg));
    }, (err: any) => {
      this.log.error(this.i18n['providers.chromecast.error'] + JSON.stringify(err));
      this.close()
    });
  }

  protected onSession = (session: any) => {
    this.log.debug(`${this.i18n['providers.chromecast.newSession']}${session.sessionId}`);
    session.addUpdateListener((isAlive: boolean) => {
      this.log.debug(`${this.i18n['providers.chromecast.' + (isAlive && 'sessionUpdated' || 'sessionRemoved')]}: ${session.sessionId}`);
      !isAlive && this.close()
    });
    session.addMessageListener(NAMESPACE, (namespace: string, message: any) => {
      // message received
      this.log.debug(`${this.i18n['providers.chromecast.messageReceived']}${message}`);
      this.message$.next(JSON.parse(message));
    });
    this.#session = session;
    this.state = ChromeCastState.CONNECTED;
  };
}
