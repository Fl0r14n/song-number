import {HttpClientModule} from '@angular/common/http';
import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {PreloadAllModules, RouteReuseStrategy, RouterModule} from '@angular/router';
import {IonicModule, IonicRouteStrategy} from '@ionic/angular';
import {TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {of} from 'rxjs';
import {AppComponent} from './app.component';
import {en} from './i18n/en';
import {ro} from './i18n/ro';

class I18nLoader implements TranslateLoader {

  lang: Record<string, any> = {
    en, ro
  }

  getTranslation(lang: string) {
    return of(this.lang[lang])
  }
}

@NgModule({
  imports: [
    BrowserModule,
    HttpClientModule,
    RouterModule.forRoot([{
      path: '',
      loadChildren: () => import('./layout/layout.module').then(m => m.LayoutModule)
    }], {
      preloadingStrategy: PreloadAllModules
    }),
    IonicModule.forRoot(),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useClass: I18nLoader
      }
    }),
  ],
  providers: [{
    provide: RouteReuseStrategy,
    useClass: IonicRouteStrategy
  }],
  declarations: [AppComponent],
  bootstrap: [AppComponent]
})
export class AppModule {
}
