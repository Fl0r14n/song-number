import {Component} from '@angular/core';
import {ModalController} from 'ionic-angular';
import {SongNumberService} from  '../../providers/song-number';
import {SelectBookModalPage} from '../select-book-modal/select-book-modal';
import { ToastController } from 'ionic-angular'

@Component({
  selector: 'page-main',
  templateUrl: 'main.html'
})
export class MainPage {

  connectSdk: any;
  discoveryManager: any;
  devices: any;

  constructor(public songNumberService: SongNumberService, public modalCtrl: ModalController, public toastCtrl: ToastController) {
    this.connectSdk = navigator['ConnectSDK'];
    if(!this.connectSdk) {
      this.toast('Connect SDK not found!...');
      return;
    }
    this.discoveryManager = this.connectSdk.discoveryManager;
  }

  openSelectBookModal() {
    let modal = this.modalCtrl.create(SelectBookModalPage, {
      books: this.songNumberService.books,
      book: this.songNumberService.book
    });
    modal.onDidDismiss(data => {
      this.songNumberService.book = data;
    });
    modal.present();
  }

  testConnectSDK(){
    this.toast('Test connect sdk');
    if(this.discoveryManager) {
      this.discoveryManager.on('startdiscovery', () => {
        this.toast('Searching for cast devices...');
      }, this);
      this.discoveryManager.on('stopdiscovery', () => {
        this.toast('Discovery stopped');
      }, this);
      this.discoveryManager.on('devicelistchanged', () => {
        this.toast('Devices list changed');
        this.devices = this.discoveryManager.getDeviceList();
        for(let device of this.devices) {
          this.toast(device.getFriendlyName());
        }
      }, this);
      var discoveryOptions = {
        capabilityFilters: [
          new this.connectSdk.CapabilityFilter(["WebAppLauncher.Launch"])
        ]
      };
      this.discoveryManager.startDiscovery(discoveryOptions);
    }
  }

  showNumber() {
    this.toast('Show number');
    if(this.discoveryManager) {
      this.discoveryManager.pickDevice().success(function (device) {
        function sendVideo() {
          device.getMediaPlayer().playMedia("http://www.connectsdk.com/files/8913/9657/0225/test_video.mp4", "video/mp4");
        }

        if (device.isReady()) { // already connected
          sendVideo();
        } else {
          device.on("ready", sendVideo);
          device.connect();
        }
      });
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
