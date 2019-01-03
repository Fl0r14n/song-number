import {NgModule} from '@angular/core';
import {IonicModule} from '@ionic/angular';
import {TranslateModule} from '@ngx-translate/core';
import {ComponentsModule} from '../components/components.module';
import {ServicesModule} from '../services/services.module';
import {AddBookModalPageComponent} from './add-book-modal/add-book-modal.page';
import {ConfigPageComponent} from './config/config.page';
import {InfoPageComponent} from './info/info.page';
import {MainPageComponent} from './main/main.page';
import {SelectBookModalPageComponent} from './select-book-modal/select-book-modal.page';
import {TabsPageComponent} from './tabs/tabs.page';
import {PagesRouterModule} from './pages.router.module';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';

const components = [
  TabsPageComponent,
  AddBookModalPageComponent,
  ConfigPageComponent,
  InfoPageComponent,
  MainPageComponent,
  SelectBookModalPageComponent
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    TranslateModule,
    ComponentsModule,
    ServicesModule,
    PagesRouterModule
  ],
  declarations: components,
  exports: components,
  entryComponents: [
    SelectBookModalPageComponent,
    AddBookModalPageComponent
  ]
})
export class PagesModule {
}
