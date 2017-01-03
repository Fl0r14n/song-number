import {Injectable} from '@angular/core';
import {ToastController} from 'ionic-angular'

@Injectable()
export class ChromecastService {

  cast: any;
  applicationId = '20CAA3A2';
  namespace = 'urn:x-cast:ro.biserica2.cast.songnumber';
  // applicationId = '794B7BBF';
  // namespace = 'urn:x-cast:com.google.cast.sample.helloworld';
  session: any = null;
  isInitialized = false;

  constructor(public toastCtrl: ToastController) {
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
      this.initialize();
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
        this.toast('new session:' + this.session.sessionId);
        this.session.addUpdateListener((isAlive) => {
          let message = isAlive ? 'session updated' : 'session removed';
          message += ': ' + this.session.sessionId;
          this.toast(message);
          if (!isAlive) {
            this.session = null;
          }
        });
        this.session.addMessageListener(this.namespace, (namespace, message) => {
          //message received
          this.toast("received from " + namespace + ": " + message);
        });
      }, (status) => {
        if (status === this.cast.ReceiverAvailability.AVAILABLE) {
          this.toast("receiver found");
        } else {
          this.toast("receiver list empty");
          this.initialize();
        }
      });
      this.cast.initialize(apiConfig, () => {
        this.toast('api init success');
        this.isInitialized = true;
      }, this.onError.bind(this));
    }
  }

  onError(msg) {
    this.toast('error: ' + JSON.stringify(msg));
  }

  onSuccess(msg) {
    this.toast("success: " + msg);
  }

  stop() {
    if (this.session) {
      this.session.stop(() => {
        this.toast('stop');
        this.session = null;
      }, this.onError.bind(this));
    }
  }

  send(msg) {
    this.toast('send meessage: ' + msg);
    if (this.session != null) {
      this.session.sendMessage(this.namespace, msg, this.onSuccess.bind(this, "sent: " + msg), this.onError.bind(this));
    } else {
      this.toast('Request session');
      this.cast.requestSession((s) => {
        this.session = s;
        this.toast('Session: ' + this.session.sessionId);
        this.session.sendMessage(this.namespace, msg, this.onSuccess.bind(this, "sent: " + msg), this.onError.bind(this));
      });
    }
  }

  toast(msg) {
    console.log(msg);
    let toast = this.toastCtrl.create({
      message: msg,
      duration: 3000
    });
    toast.present();
  }
}
