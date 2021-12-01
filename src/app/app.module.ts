import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {PreloadAllModules, RouteReuseStrategy, RouterModule, Routes} from '@angular/router';
import {IonicModule, IonicRouteStrategy} from '@ionic/angular';
import {AppComponent} from './app.component';
import {TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {HttpClientModule} from '@angular/common/http';
import {Observable} from 'rxjs';
import {en} from './i18n/en';
import {ro} from './i18n/ro';

export class I18nLoader implements TranslateLoader {

  lang = {
    en, ro
  };

  getTranslation(lang: string): Observable<any> {
    return new Observable<any>(subscriber => {
      subscriber.next(this.lang[lang]);
      subscriber.complete();
    });
  }
}

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./layout/layout.module').then(m => m.LayoutModule)
  }
];

@NgModule({
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    RouterModule.forRoot(routes, {preloadingStrategy: PreloadAllModules}),
    HttpClientModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useClass: I18nLoader
      }
    }),
  ],
  declarations: [AppComponent],
  providers: [{provide: RouteReuseStrategy, useClass: IonicRouteStrategy}],
  bootstrap: [AppComponent]
})
export class AppModule {
}
