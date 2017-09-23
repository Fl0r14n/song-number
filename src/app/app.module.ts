import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import {PagesModule} from '../pages/pages.module';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import {InfoPage} from '../pages/info/info.page';
import {MainPage} from '../pages/main/main.page';
import {ConfigPage} from '../pages/config/config.page';
import {AddBookModalPage} from '../pages/add-book-modal/add-book-modal.page';
import {SelectBookModalPage} from '../pages/select-book-modal/select-book-modal.page';
import {TabsPage} from '../pages/tabs/tabs.page';
import {IonicStorageModule} from '@ionic/storage';
import {Http, HttpModule} from '@angular/http';


export function createTranslateLoader(http: Http) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
  declarations: [
    MyApp,
  ],
  imports: [
    BrowserModule,
    HttpModule,
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot(MyApp),
    PagesModule,
    // i18n
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: (createTranslateLoader),
        deps: [Http]
      }
    })
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    InfoPage,
    MainPage,
    ConfigPage,
    AddBookModalPage,
    SelectBookModalPage,
    TabsPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
