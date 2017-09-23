import {Component} from '@angular/core';
import {Platform} from 'ionic-angular';
import {StatusBar} from '@ionic-native/status-bar';
import {SplashScreen} from '@ionic-native/splash-screen';
import {TabsPage} from '../pages/tabs/tabs.page';
import {BackgroundMode} from '@ionic-native/background-mode';
import {TranslateService} from '@ngx-translate/core';


@Component({
  templateUrl: 'app.html'
})
export class MyApp {

  rootPage = TabsPage;

  i18n: any[];

  constructor(protected platform: Platform,
              protected statusBar: StatusBar,
              protected splashScreen: SplashScreen,
              i18nService: TranslateService,
              protected backgroundMode: BackgroundMode) {
    i18nService.setDefaultLang('en');
    i18nService.use(i18nService.getBrowserLang());
    i18nService.get([
      'nav.main',
      'nav.info',
      'nav.config',
      'backgroundMode.defaultTitle',
      'backgroundMode.defaultText'
    ]).subscribe((value) => {
      this.i18n = value;
      this.initializeApp();
    });
  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.styleDefault();
      this.splashScreen.hide();
      this.backgroundMode.enable();
      this.backgroundMode.setDefaults({
        title: this.i18n['backgroundMode.defaultTitle'],
        text: this.i18n['backgroundMode.defaultText'],
        ticker: ''
      });
    });
  }
}
