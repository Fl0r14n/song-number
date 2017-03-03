import {Injectable} from '@angular/core';
import {LoggerService} from "./logger";
import {TranslateService} from "ng2-translate";

@Injectable()
export class ChromecastService {

  applicationId: string = '20CAA3A2';
  namespace: string = 'urn:x-cast:ro.biserica2.cast.songnumber';

  private _isInitialised: boolean = false;
  private _isReceiverFound: boolean = false;
  private i18n: any[];
  private cast: any;
  private session: any = null;
  // prevent some initialize bug when opening the application for the first time
  private _reinitilize: boolean = true;

  constructor(i18nService: TranslateService, public log: LoggerService) {
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
      // now initialize chromecast
      this.loadScript();
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
            onReceiverFound();
          }
        } else {
          this._isReceiverFound = false;
          this.log.warn(this.i18n['providers.chromecast.receiverNotFound']);
          //workaround
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
      this.session.sendMessage(this.namespace, msg, this.onSuccess.bind(this, this.i18n['providers.chromecast.sendMessage'] + msg), this.onError.bind(this));
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
      let message = isAlive ? this.i18n['providers.chromecast.sessionUpdated'] : this.i18n['providers.chromecast.sessionRemoved'];
      message += ': ' + this.session.sessionId;
      this.log.debug(message);
      if (!isAlive) {
        this.session = null;
      }
    });
    this.session.addMessageListener(this.namespace, (namespace, message) => {
      // message received
      this.log.debug(this.i18n['providers.chromecast.messageReceived'] + message);
    });
  }

  private onError(msg) {
    this.log.error(this.i18n['providers.chromecast.error'] + JSON.stringify(msg));
  }

  private onSuccess(msg) {
    this.log.debug(this.i18n['providers.chromecast.success'] + msg);
  }
}
