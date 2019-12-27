import {NgModule} from '@angular/core';
import {LoggerService} from './services/logger.service';
import {ChromeCastService} from './services/chrome-cast.service';
import {SongBooksService} from './services/song-books.service';
import {SongNumberService} from './services/song-number.service';
import {CameraService} from './services/camera.service';
import {HttpClientModule} from '@angular/common/http';
import {Camera} from '@ionic-native/camera/ngx';

@NgModule({
  imports: [
    HttpClientModule,
  ],
  providers: [
    LoggerService,
    ChromeCastService,
    SongBooksService,
    SongNumberService,
    CameraService,
    Camera
  ]
})
export class SharedModule {
}
