import {Injectable} from '@angular/core';
import {Storage} from '@ionic/storage';
import {ToastController} from 'ionic-angular'

const STORAGE_ID_DEBUG = 'song-number-settings-log-level';

@Injectable()
export class LoggerService {

  public static get INFO(): number {
    return 0;
  }

  public static get WARN(): number {
    return 1;
  }

  public static get ERROR(): number {
    return 2;
  }

  public static get DEBUG(): number {
    return 3;
  }

  private _logLevel: number = LoggerService.ERROR;

  constructor(private storage: Storage,
              private toastCtrl: ToastController) {
    this.storage.get(STORAGE_ID_DEBUG).then(data => {
      if (data) {
        this._logLevel = data;
      } else {
        this.logLevel = LoggerService.INFO;
      }
    });
  }

  get logLevel(): number {
    return this._logLevel;
  }

  set logLevel(value: number) {
    this._logLevel = value;
    this.storage.set(STORAGE_ID_DEBUG, value);
  }

  info(message) {
    this.toast(message, 'toast-info');
  }

  warn(message) {
    if (this.logLevel >= LoggerService.WARN) {
      this.toast(message, 'toast-warn');
    }
  }

  error(message) {
    if (this.logLevel >= LoggerService.ERROR) {
      this.toast(message, 'toast-error');
    }
  }

  debug(message) {
    if (this.logLevel >= LoggerService.DEBUG) {
      this.toast(message, 'toast-debug');
    }
  }

  private toast(msg, cssClass?: string) {
    let toastSettings: any = {
      message: msg,
      duration: 3000
    };
    if (cssClass) {
      toastSettings.cssClass = cssClass;
    }
    let toast = this.toastCtrl.create(toastSettings);
    toast.present();
  }
}
