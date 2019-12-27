import {NgModule} from '@angular/core';
import {LoggerService} from './logger.service';
import {SongNumberService} from './song-number.service';
import {CameraService} from './camera.service';
import {SongBooksService} from './song-books.service';
import {ChromeCastService} from './chrome-cast.service';
import {HttpClientModule} from '@angular/common/http';
import {Camera} from '@ionic-native/camera/ngx';

@NgModule({
  imports: [
    HttpClientModule
  ],
  providers: [
    ChromeCastService,
    LoggerService,
    SongBooksService,
    SongNumberService,
    CameraService,
    Camera
  ]
})
export class ServicesModule {
}
