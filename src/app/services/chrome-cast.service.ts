import {EventEmitter, Injectable} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {LoggerService} from './logger.service';

export enum ChromeCastState {
  DISABLED = 0,
  INITIALIZED = 1,
  AVAILABLE = 3,
  CONNECTED = 7
}

@Injectable()
export class ChromeCastService {

  applicationId = '20CAA3A2';
  namespace = 'urn:x-cast:ro.biserica2.cast.songnumber';

  private i18n: any[];
  private cast: any;
  private session: any;

  private _state: ChromeCastState = ChromeCastState.DISABLED;
  public stateChanged: EventEmitter<ChromeCastState> = new EventEmitter();
  public messageListener: EventEmitter<any> = new EventEmitter();

  constructor(private i18nService: TranslateService,
              private log: LoggerService) {
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
    ]).subscribe((value) => {
      this.i18n = value;
      // decouple
      setTimeout(() => {
        // now initialize chromecast
        this.loadScript();
      }, 1000);
    });
  }

  public get state(): ChromeCastState {
    return this._state;
  }

  private setState(state: ChromeCastState) {
    this._state = state;
    this.stateChanged.emit(state);
  }

  init() {
    this.cast = window['chrome'].cast;
    if (this.cast) {
      const apiConfig = new this.cast.ApiConfig(new this.cast.SessionRequest(this.applicationId), this.onSession.bind(this), (status) => {
        switch (status) {
          case this.cast.ReceiverAvailability.UNAVAILABLE: {
            this.setState(ChromeCastState.INITIALIZED);
            // close session if existed
            this.close(ChromeCastState.INITIALIZED);
            this.log.warn(this.i18n['providers.chromecast.receiverNotFound']);
            break;
          }
          case this.cast.ReceiverAvailability.AVAILABLE: {
            if (!this.session) {
              this.setState(ChromeCastState.AVAILABLE);
            }
            this.log.info(this.i18n['providers.chromecast.receiverFound']);
            break;
          }
          default: {
            this.setState(ChromeCastState.DISABLED);
          }
        }
      });
      this.cast.initialize(apiConfig, () => {
        this.setState(ChromeCastState.INITIALIZED);
      }, this.onError.bind(this));
    }
  }

  open() {
    if (this.state === ChromeCastState.AVAILABLE) {
      this.cast.requestSession(this.onSession.bind(this));
    } else {
      if (this.state === ChromeCastState.INITIALIZED) {
        // force init since it might not get it the first time
        this.init();
      }
    }
  }

  close(state?: ChromeCastState) {
    if (this.session) {
      this.session.stop(() => {
        this.setState(state ? state : ChromeCastState.AVAILABLE);
        this.log.debug(this.i18n['providers.chromecast.stop']);
        delete this.session;
      }, this.onError.bind(this));
    }
  }

  send(msg) {
    if (this.session) {
      this.session.sendMessage(this.namespace, msg, this.onSendSuccess.bind(this, msg), this.onError.bind(this));
    }
  }

  private loadScript() {
    this.cast = window['chrome'].cast;
    if (this.cast) {
      this.init();
    } else {
      // inject script if in browser mode
      const head = document.getElementsByTagName('head')[0];
      const script = document.createElement('script');
      script.type = 'text/javascript';
      script.src = 'https://www.gstatic.com/cv/js/sender/v1/cast_sender.js';
      script.onload = this.onLoadCastApi.bind(this);
      head.appendChild(script);
    }
  }

  private onLoadCastApi() {
    this.cast = window['chrome'].cast;
    if (this.cast) {
      this.init();
    } else {
      // might not be injected in page
      setTimeout(this.init.bind(this), 1000);
    }
  }

  private onSession(session: any) {
    this.setState(ChromeCastState.CONNECTED);
    this.session = session;
    this.log.info(this.i18n['providers.chromecast.newSession'] + this.session.sessionId);
    this.session.addUpdateListener((isAlive) => {
      if (this.session) {
        let message = isAlive ? this.i18n['providers.chromecast.sessionUpdated'] : this.i18n['providers.chromecast.sessionRemoved'];
        message += ': ' + this.session.sessionId;
        this.log.debug(message);
        if (!isAlive) {
          this.close();
        }
      }
    });
    this.session.addMessageListener(this.namespace, (namespace, message) => {
      // message received
      this.log.debug(this.i18n['providers.chromecast.messageReceived'] + message);
      this.messageListener.emit(JSON.parse(message));
    });
  }

  private onError(err) {
    this.log.error(this.i18n['providers.chromecast.error'] + err);
  }

  private onSendSuccess(msg) {
    this.log.debug(this.i18n['providers.chromecast.sendMessage'] + JSON.stringify(msg));
  }
}
