import { Component } from '@angular/core';

import {MainPage} from '../main/main.page';
import {InfoPage} from '../info/info.page';
import {ConfigPage} from '../config/config.page';

@Component({
  templateUrl: 'tabs.page.html'
})
export class TabsPage {

  tab1Root = MainPage;
  tab2Root = InfoPage;
  tab3Root = ConfigPage;
}
