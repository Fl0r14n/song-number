import {NgModule} from '@angular/core';
import {ChromecastService} from './chromecast.service';
import {LoggerService} from './logger.service';
import {SongNumberService} from './song-number.service';

@NgModule({
  providers: [
    ChromecastService,
    LoggerService,
    SongNumberService
  ]
})
export class ProvidersModule {
}
