import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {ConfigPageComponent} from './pages/config.page';
import {BookModalPageComponent} from './components/book-modal/book-modal.component';
import {IonicModule} from '@ionic/angular';
import {TranslateModule} from '@ngx-translate/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';

const entryComponents = [
  BookModalPageComponent
];

const declarations = [
  ...entryComponents,
  ConfigPageComponent
];

const routes: Routes = [
  {
    path: '',
    component: ConfigPageComponent
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
    IonicModule,
    TranslateModule,
    FormsModule,
    CommonModule,
    ReactiveFormsModule
  ],
  entryComponents,
  declarations
})
export class ConfigModule {
}
