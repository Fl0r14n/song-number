import {Component} from '@angular/core';
import {Platform} from '@ionic/angular';
import {TranslateService} from '@ngx-translate/core';
import {SplashScreen} from '@capacitor/splash-screen';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html'
})
export class AppComponent {

  constructor(
    private platform: Platform,
    private i18nService: TranslateService,
  ) {
    this.initializeApp();
  }

  async initializeApp() {
    this.i18nService.setDefaultLang('en');
    this.i18nService.use(this.i18nService.getBrowserLang());
    await this.platform.ready();
    await SplashScreen.hide();
  }
}
