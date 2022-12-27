import {Component} from '@angular/core';
import {App} from '@capacitor/app';
import {IonRouterOutlet, Platform} from '@ionic/angular';

@Component({
  selector: 'layout-page',
  template: `
    <ion-tabs>
      <ion-tab-bar slot="bottom">
        <ion-tab-button tab="main">
          <ion-icon name="home"></ion-icon>
        </ion-tab-button>
        <ion-tab-button tab="info">
          <ion-icon name="information-circle"></ion-icon>
        </ion-tab-button>
        <ion-tab-button tab="books">
          <ion-icon name="list"></ion-icon>
        </ion-tab-button>
        <ion-tab-button tab="config">
          <ion-icon name="settings"></ion-icon>
        </ion-tab-button>
      </ion-tab-bar>
    </ion-tabs>
  `
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
