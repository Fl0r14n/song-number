import {NgModule} from '@angular/core';
import {ChromecastService} from './chromecast.service';
import {LoggerService} from './logger.service';
import {SongNumberService} from './song-number.service';
import {IonicStorageModule} from '@ionic/storage';
import {BackgroundMode} from '@ionic-native/background-mode';

@NgModule({
  imports: [
    IonicStorageModule
  ],
  providers: [
    ChromecastService,
    LoggerService,
    SongNumberService,
    BackgroundMode
  ]
})
export class ProvidersModule {
}
