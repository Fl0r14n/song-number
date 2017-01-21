import {Component, ViewChild} from '@angular/core';
import {Nav, Platform} from 'ionic-angular';
import {StatusBar, Splashscreen, BackgroundMode} from 'ionic-native';
import {TranslateService} from 'ng2-translate'
import {MainPage} from '../pages/main/main';
import {InfoPage} from '../pages/info/info';
import {ConfigPage} from '../pages/config/config';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {

  @ViewChild(Nav) nav: Nav;

  rootPage: any = MainPage;

  pages: {title: string, component: any}[];

  i18n: any[];

  constructor(public platform: Platform, i18nService: TranslateService) {
    i18nService.setDefaultLang('en');
    let lang = i18nService.getBrowserCultureLang().split('-')[0];
    i18nService.use(lang);
    console.log();
    i18nService.get([
      'nav.main',
      'nav.info',
      'nav.config',
      'backgroundMode.defaultTitle',
      'backgroundMode.defaultText'
    ]).subscribe((value) => {
      this.i18n = value;
      this.initializeApp();
      // used for an example of ngFor and navigation
      this.pages = [
        {title: this.i18n['nav.main'], component: MainPage},
        {title: this.i18n['nav.info'], component: InfoPage},
        {title: this.i18n['nav.config'], component: ConfigPage}
      ];
    });
  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      StatusBar.styleDefault();
      Splashscreen.hide();
      BackgroundMode.enable();
      BackgroundMode.setDefaults({
        title: this.i18n['backgroundMode.defaultTitle'],
        text: this.i18n['backgroundMode.defaultText'],
        ticker: ''
      });
    });
  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page.component);
  }
}
