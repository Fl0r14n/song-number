import {Injectable} from '@angular/core';
import {ToastController} from '@ionic/angular';
import {noop} from 'rxjs';
import {Storage} from '@ionic/storage';


const STORAGE_ID_DEBUG = 'song-number-settings-log-level';

@Injectable({
  providedIn: 'root'
})
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

  // tslint:disable-next-line:variable-name
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
    this.storage.set(STORAGE_ID_DEBUG, value).then(noop, noop);
  }

  async info(message) {
    return await this.toast(message, 'toast-info');
  }

  async warn(message) {
    if (this.logLevel >= LoggerService.WARN) {
      return await this.toast(message, 'toast-warn');
    }
  }

  async error(message) {
    if (this.logLevel >= LoggerService.ERROR) {
      return await this.toast(message, 'toast-error');
    }
  }

  async debug(message) {
    if (this.logLevel >= LoggerService.DEBUG) {
      return await this.toast(message, 'toast-debug');
    }
  }

  private async toast(msg, cssClass?: string) {
    const toastSettings: any = {
      message: msg,
      duration: 3000
    };
    if (cssClass) {
      toastSettings.cssClass = cssClass;
    }
    const toast = await this.toastCtrl.create(toastSettings);
    return toast.present();
  }
}
