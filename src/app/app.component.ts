import {Component} from '@angular/core';
import {Platform} from '@ionic/angular';
import {TranslateService} from '@ngx-translate/core';
import {Plugins} from '@capacitor/core';

const {SplashScreen} = Plugins;

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

  initializeApp() {
    this.i18nService.setDefaultLang('en');
    this.i18nService.use(this.i18nService.getBrowserLang());
    this.platform.ready().then(() => {
      SplashScreen.hide();
    });
  }
}
