import {NgModule, ErrorHandler} from '@angular/core';
import {IonicApp, IonicModule, IonicErrorHandler} from 'ionic-angular';
import {Storage} from '@ionic/storage';
import {MyApp} from './app.component';
import {MainPage} from '../pages/main/main';
import {InfoPage} from '../pages/info/info';
import {ConfigPage} from '../pages/config/config';
import {AddBookModalPage} from '../pages/add-book-modal/add-book-modal';
import {SelectBookModalPage} from '../pages/select-book-modal/select-book-modal';
import {SongDigitComponent} from '../components/song-digit/song-digit';
import {SongNumberComponent} from '../components/song-number/song-number';
import {SongNumberService} from  '../providers/song-number';
import {ChromecastService} from '../providers/chromecast';

@NgModule({
  declarations: [
    MyApp,
    MainPage,
    InfoPage,
    ConfigPage,
    AddBookModalPage,
    SelectBookModalPage,
    SongDigitComponent,
    SongNumberComponent
  ],
  imports: [
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    InfoPage,
    MainPage,
    ConfigPage,
    AddBookModalPage,
    SelectBookModalPage
  ],
  providers: [
    SongNumberService, ChromecastService, Storage,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {
}
