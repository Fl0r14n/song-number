import {NgModule} from '@angular/core';
import {AddBookModalPage} from './add-book-modal/add-book-modal.page';
import {ConfigPage} from './config/config.page';
import {InfoPage} from './info/info.page';
import {MainPage} from './main/main.page';
import {SelectBookModalPage} from './select-book-modal/select-book-modal.page';
import {ComponentsModule} from '../components/components.module';
import {ProvidersModule} from '../providers/providers.module';
import {IonicModule} from 'ionic-angular';
import {TranslateModule} from 'ng2-translate';
import {TabsPage} from './tabs/tabs.page';

@NgModule({
  imports: [
    IonicModule,
    TranslateModule,
    ComponentsModule,
    ProvidersModule
  ],
  declarations: [
    AddBookModalPage,
    ConfigPage,
    InfoPage,
    MainPage,
    SelectBookModalPage,
    TabsPage
  ],
  exports: [
    AddBookModalPage,
    ConfigPage,
    InfoPage,
    MainPage,
    SelectBookModalPage,
    TabsPage
  ]
})
export class PagesModule {
}
