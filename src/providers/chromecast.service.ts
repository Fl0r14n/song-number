import {EventEmitter, Injectable} from '@angular/core';
import {LoggerService} from './logger.service';
import {TranslateService} from '@ngx-translate/core';

@Injectable()
export class ChromecastService {

  applicationId = '20CAA3A2';
  namespace = 'urn:x-cast:ro.biserica2.cast.songnumber';

  private _isInitialised = false;
  private _isReceiverFound = false;
  private i18n: any[];
  private cast: any;
  private session: any = null;
  // prevent some initialize bug when opening the application for the first time
  private _reinitilize = true;

  messageListener: EventEmitter<any> = new EventEmitter();

  constructor(i18nService: TranslateService,
              protected log: LoggerService) {
    i18nService.get([
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

  init(onReceiverFound?: () => void) {
    this.cast = window['chrome'].cast;
    if (this.cast) {
      let apiConfig = new this.cast.ApiConfig(new this.cast.SessionRequest(this.applicationId), this.onSession.bind(this), (status) => {
        if (status === this.cast.ReceiverAvailability.AVAILABLE) {
          this._isReceiverFound = true;
          this.log.info(this.i18n['providers.chromecast.receiverFound']);
          if (onReceiverFound) {
            setTimeout(() => {
              onReceiverFound();
            }, 100);
          }
        } else {
          this._isReceiverFound = false;
          this.log.warn(this.i18n['providers.chromecast.receiverNotFound']);
          // workaround
          if (this._reinitilize) {
            this._reinitilize = false;
            this.init();
          }
        }
      });
      this.cast.initialize(apiConfig, () => {
        this._isInitialised = true;
      }, this.onError.bind(this));
    }
  }

  open() {
    if (this._isReceiverFound) {
      this.cast.requestSession(this.onSession.bind(this));
    } else {
      this.init(() => {
        this.open();
      })
    }
  }

  close() {
    if (this.session) {
      this.session.stop(() => {
        this.log.debug(this.i18n['providers.chromecast.stop']);
        this.session = null;
      }, this.onError.bind(this));
    }
  }

  isInitialised(): boolean {
    return this._isInitialised
  }

  isReceiverFound(): boolean {
    return this._isReceiverFound
  }

  isConnected(): boolean {
    return !!this.session;
  }

  send(msg) {
    if (this.session != null) {
      this.session.sendMessage(this.namespace, msg, this.onSendSuccess.bind(this, msg), this.onError.bind(this));
    }
  }

  private loadScript() {
    this.cast = window['chrome'].cast;
    if (!this.cast) {
      // inject script if in browser mode
      let head = document.getElementsByTagName('head')[0];
      let script = document.createElement('script');
      script.type = 'text/javascript';
      script.src = '//www.gstatic.com/cv/js/sender/v1/cast_sender.js';
      script.onload = this.checkForCastApi.bind(this);
      head.appendChild(script);
    } else {
      this.checkForCastApi();
    }
  }

  private checkForCastApi() {
    this.cast = window['chrome'].cast;
    if (!this.cast) {
      setTimeout(this.init.bind(this), 1000);
    } else {
      this.init();
    }
  }

  private onSession(session: any) {
    this.session = session;
    this.log.info(this.i18n['providers.chromecast.newSession'] + this.session.sessionId);
    this.session.addUpdateListener((isAlive) => {
      if (this.session) {
        let message = isAlive ? this.i18n['providers.chromecast.sessionUpdated'] : this.i18n['providers.chromecast.sessionRemoved'];
        message += ': ' + this.session.sessionId;
        this.log.debug(message);
        if (!isAlive) {
          this.session = null;
        }
      }
    });
    this.session.addMessageListener(this.namespace, (namespace, message) => {
      // message received
      this.log.debug(this.i18n['providers.chromecast.messageReceived'] + message);
      this.messageListener.next(JSON.parse(message));
    });
  }

  private onError(err) {
    this.log.error(this.i18n['providers.chromecast.error'] + err);
  }

  private onSendSuccess(msg) {
    this.log.debug(this.i18n['providers.chromecast.sendMessage'] + JSON.stringify(msg));
  }
}
