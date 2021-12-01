import {Component} from '@angular/core';
import {App} from '@capacitor/app';
import {IonRouterOutlet, Platform} from '@ionic/angular';

@Component({
  selector: 'layout-page',
  templateUrl: 'layout.page.html',
})
export class LayoutPageComponent {

  constructor(private platform: Platform,
              private routerOutlet: IonRouterOutlet) {
    this.platform.backButton.subscribeWithPriority(-1, () => {
      if (!this.routerOutlet.canGoBack()) {
        App.exitApp();
      }
    });
  }
}
