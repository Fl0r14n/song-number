import {Injectable} from '@angular/core';
import {ToastController} from 'ionic-angular'

@Injectable()
export class ChromecastService {

  cast: any;
  applicationId = '20CAA3A2';
  namespace = 'urn:x-cast:ro.biserica2.cast.songnumber';
  // applicationId = '794B7BBF';
  // namespace = 'urn:x-cast:com.google.cast.sample.helloworld';
  session: any;

  constructor(public toastCtrl: ToastController) {
    this.cast = window['chrome'].cast;
    this.loadScript();
    this.initialize();
  }


  loadScript() {
    //inject script if in browser mode
    if (!this.cast) {
      console.log('Loading js cast script');
      let head = document.getElementsByTagName('head')[0];
      let script = document.createElement('script');
      script.type = 'text/javascript';
      script.src = '//www.gstatic.com/cv/js/sender/v1/cast_sender.js';
      script.onload = this.initialize;
      head.appendChild(script);
    }
  }

  initialize() {
    if (this.cast) {
      let sessionRequest = new this.cast.SessionRequest(this.applicationId);
      let apiConfig = new this.cast.ApiConfig(sessionRequest, (s) => {
        //new session
        this.session = s;
        this.toast('New session ID:' + this.session.sessionId);
        this.session.addUpdateListener((isAlive) => {
          let message = isAlive ? 'Session Updated' : 'Session Removed';
          message += ': ' + this.session.sessionId;
          this.toast(message);
          if (!isAlive) {
            this.session = null;
          }

        });
        this.session.addMessageListener(this.namespace, (namespace, message) => {
          //message received
          this.toast("receiverMessage: " + namespace + ", " + message);
        });
      }, (status) => {
        if (status === this.cast.ReceiverAvailability.AVAILABLE) {
          this.toast("receiver found");
        }
        else {
          this.toast("receiver list empty");
        }
      });
      this.cast.initialize(apiConfig, () => {
        this.toast('chromecast api init success');
      }, this.onError);
    }
  }

  onError(msg) {
    this.toast('onError: ' + JSON.stringify(msg));
  }

  onSuccess(msg) {
    this.toast("onSuccess: " + msg);
  }

  stop() {
    if (this.session) {
      this.session.stop(() => {
        this.toast('onStopAppSuccess');
      }, this.onError);
    }
  }

  send(msg) {
    this.toast('Send Message: ' + msg);
    if (this.session) {
      if (this.session) {
        this.session.sendMessage(this.namespace, msg, this.onSuccess.bind(this, "Message sent: " + msg), this.onError);
      } else {
        this.toast('Request session');
        this.cast.requestSession((s) => {
          this.session = s;
          this.toast('Session: ' + this.session.sessionId);
          this.session.sendMessage(this.namespace, msg, this.onSuccess.bind(this, "Message sent: " + msg), this.onError);
        });
      }
    }
  }

  toast(msg) {
    let toast = this.toastCtrl.create({
      message: msg,
      duration: 3000
    });
    toast.present();
  }
}
