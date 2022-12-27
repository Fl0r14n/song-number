import {Injectable} from '@angular/core';
import {ToastController} from '@ionic/angular';
import {StorageModel} from '../storage';

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

  logLevel = new StorageModel(STORAGE_ID_DEBUG, LogLevel.INFO, (value) => Number(value))

  constructor(protected toastCtrl: ToastController) {
  }

  async info(message: any) {
    return this.toast(message, 'toast-info');
  }

  async warn(message: any) {
    if (this.logLevel.model >= LogLevel.WARN) {
      return this.toast(message, 'toast-warn');
    }
  }

  async error(message: any) {
    if (this.logLevel.model >= LogLevel.ERROR) {
      return this.toast(message, 'toast-error');
    }
  }

  async debug(message: any) {
    if (this.logLevel.model >= LogLevel.DEBUG) {
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
