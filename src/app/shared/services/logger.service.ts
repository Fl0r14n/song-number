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

  #logLevel = LogLevel.ERROR;

  constructor(private storage: StorageService,
              private toastCtrl: ToastController) {
    this.storage.get(STORAGE_ID_DEBUG).then(value => value ? this.#logLevel = Number(value) : this.logLevel = LogLevel.INFO, noop);
  }

  get logLevel(): LogLevel {
    return this.#logLevel;
  }

  set logLevel(value: LogLevel) {
    this.#logLevel = value;
    this.storage.set(STORAGE_ID_DEBUG, value).then(noop, noop);
  }

  async info(message: any) {
    return this.toast(message, 'toast-info');
  }

  async warn(message: any) {
    if (this.logLevel >= LogLevel.WARN) {
      return this.toast(message, 'toast-warn');
    }
  }

  async error(message: any) {
    if (this.logLevel >= LogLevel.ERROR) {
      return this.toast(message, 'toast-error');
    }
  }

  async debug(message: any) {
    if (this.logLevel >= LogLevel.DEBUG) {
      return this.toast(message, 'toast-debug');
    }
  }

  private async toast(msg: any, cssClass?: string) {
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
