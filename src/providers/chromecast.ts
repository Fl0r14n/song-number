import {Injectable} from '@angular/core';
import {LoggerService} from "./logger";

@Injectable()
export class ChromecastService {

  cast: any;
  applicationId: string = '20CAA3A2';
  namespace: string = 'urn:x-cast:ro.biserica2.cast.songnumber';
  session: any = null;
  isInitialized: boolean = false;
  receivesFound: boolean = false;
  //prevent some initialize bug when opening the application for the first time
  private _reinitilize: boolean = true;

  constructor(public log: LoggerService) {
    this.loadScript();
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
        this.log.info('new session:' + this.session.sessionId);
        this.session.addUpdateListener((isAlive) => {
          let message = isAlive ? 'session updated' : 'session removed';
          message += ': ' + this.session.sessionId;
          this.log.debug(message);
          if (!isAlive) {
            this.session = null;
          }
        });
        this.session.addMessageListener(this.namespace, (namespace, message) => {
          //message received
          this.log.debug('received from ' + namespace + ': ' + message);
        });
      }, (status) => {
        if (status === this.cast.ReceiverAvailability.AVAILABLE) {
          this.receivesFound = true;
          this.log.info('receiver found');
        } else {
          this.receivesFound = false;
          this.log.warn('receiver list empty');
          //workaround
          if (this._reinitilize) {
            this._reinitilize = false;
            this.initialize();
          }
        }
      });
      this.cast.initialize(apiConfig, () => {
        this.log.info('api init success');
        this.isInitialized = true;
      }, this.onError.bind(this));
    }
  }

  onError(msg) {
    this.log.error('error: ' + JSON.stringify(msg));
  }

  onSuccess(msg) {
    this.log.debug('success: ' + msg);
  }

  stop() {
    if (this.session) {
      this.session.stop(() => {
        this.log.debug('stop');
        this.session = null;
      }, this.onError.bind(this));
    }
  }

  send(msg) {
    this.log.debug('send meessage: ' + msg);
    if (this.session != null) {
      this.session.sendMessage(this.namespace, msg, this.onSuccess.bind(this, "sent: " + msg), this.onError.bind(this));
    } else {
      this.log.debug('Request session');
      this.cast.requestSession((s) => {
        this.session = s;
        this.log.debug('Session: ' + this.session.sessionId);
        this.session.sendMessage(this.namespace, msg, this.onSuccess.bind(this, "sent: " + msg), this.onError.bind(this));
      });
    }
  }
}
