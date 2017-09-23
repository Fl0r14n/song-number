import {NgModule} from '@angular/core';
import {AddBookModalPage} from './add-book-modal/add-book-modal.page';
import {ConfigPage} from './config/config.page';
import {InfoPage} from './info/info.page';
import {MainPage} from './main/main.page';
import {SelectBookModalPage} from './select-book-modal/select-book-modal.page';
import {ComponentsModule} from '../components/components.module';
import {ProvidersModule} from '../providers/providers.module';

@NgModule({
  imports: [
    ComponentsModule,
    ProvidersModule
  ],
  declarations: [
    AddBookModalPage,
    ConfigPage,
    InfoPage,
    MainPage,
    SelectBookModalPage
  ],
  exports: [
    AddBookModalPage,
    ConfigPage,
    InfoPage,
    MainPage,
    SelectBookModalPage
  ]
})
export class PagesModule {
}
