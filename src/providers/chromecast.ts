import {Injectable} from '@angular/core';
import {LoggerService} from "./logger";
import {TranslateService} from "ng2-translate";

@Injectable()
export class ChromecastService {

  i18n: any[];
  cast: any;
  applicationId: string = '20CAA3A2';
  namespace: string = 'urn:x-cast:ro.biserica2.cast.songnumber';
  session: any = null;
  isInitialized: boolean = false;
  receivesFound: boolean = false;
  //prevent some initialize bug when opening the application for the first time
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
      //now initialize chromecast
      this.loadScript();
    });
  }

  loadScript() {
    this.cast = window['chrome'].cast;
    if (!this.cast) {
      //inject script if in browser mode
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

  checkForCastApi() {
    this.cast = window['chrome'].cast;
    if (!this.cast) {
      setTimeout(this.initialize.bind(this), 1000);
    } else {
      this.initialize();
    }
  }

  initialize() {
    this.cast = window['chrome'].cast;
    if (this.cast) {
      let sessionRequest = new this.cast.SessionRequest(this.applicationId);
      let apiConfig = new this.cast.ApiConfig(sessionRequest, (s) => {
        //new session
        this.session = s;
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
          //message received
          this.log.debug(this.i18n['providers.chromecast.messageReceived'] + message);
        });
      }, (status) => {
        if (status === this.cast.ReceiverAvailability.AVAILABLE) {
          this.receivesFound = true;
          this.log.info(this.i18n['providers.chromecast.receiverFound']);
        } else {
          this.receivesFound = false;
          this.log.warn(this.i18n['providers.chromecast.receiverNotFound']);
          //workaround
          if (this._reinitilize) {
            this._reinitilize = false;
            this.initialize();
          }
        }
      });
      this.cast.initialize(apiConfig, () => {
        this.isInitialized = true;
      }, this.onError.bind(this));
    }
  }

  onError(msg) {
    this.log.error(this.i18n['providers.chromecast.error'] + JSON.stringify(msg));
  }

  onSuccess(msg) {
    this.log.debug(this.i18n['providers.chromecast.success'] + msg);
  }

  stop() {
    if (this.session) {
      this.session.stop(() => {
        this.log.debug(this.i18n['providers.chromecast.stop']);
        this.session = null;
      }, this.onError.bind(this));
    }
  }

  send(msg) {
    if (this.session != null) {
      this.session.sendMessage(this.namespace, msg, this.onSuccess.bind(this, this.i18n['providers.chromecast.sendMessage'] + msg), this.onError.bind(this));
    } else {
      this.cast.requestSession((s) => {
        this.session = s;
        this.log.debug(this.i18n['providers.chromecast.session'] + this.session.sessionId);
        this.session.sendMessage(this.namespace, msg, this.onSuccess.bind(this, this.i18n['providers.chromecast.sendMessage'] + msg), this.onError.bind(this));
      });
    }
  }
}
