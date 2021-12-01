import {Injectable} from '@angular/core';
import {ToastController} from '@ionic/angular';
import {noop} from 'rxjs';
import {StorageService} from './storage.service';

const STORAGE_ID_DEBUG = 'song-number-settings-log-level';

export enum LogLevel {
  INFO,
  WARN,
  ERROR,
  DEBUG
}

@Injectable({
  providedIn: 'root'
})
export class LoggerService {

  private _logLevel: LogLevel = LogLevel.ERROR;

  constructor(private storage: StorageService,
              private toastCtrl: ToastController) {
    this.storage.get(STORAGE_ID_DEBUG).then(value => value ? this._logLevel = Number(value) : this.logLevel = LogLevel.INFO, noop);
  }

  get logLevel(): LogLevel {
    return this._logLevel;
  }

  set logLevel(value: LogLevel) {
    this._logLevel = value;
    this.storage.set(STORAGE_ID_DEBUG, value).then(noop, noop);
  }

  async info(message) {
    return this.toast(message, 'toast-info');
  }

  async warn(message) {
    if (this.logLevel >= LogLevel.WARN) {
      return this.toast(message, 'toast-warn');
    }
  }

  async error(message) {
    if (this.logLevel >= LogLevel.ERROR) {
      return this.toast(message, 'toast-error');
    }
  }

  async debug(message) {
    if (this.logLevel >= LogLevel.DEBUG) {
      return this.toast(message, 'toast-debug');
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
