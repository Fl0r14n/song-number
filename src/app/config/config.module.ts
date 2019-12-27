import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {ConfigPageComponent} from './pages/config.page';
import {BookModalPageComponent} from './components/book-modal/book-modal.component';
import {IonicModule} from '@ionic/angular';
import {TranslateModule} from '@ngx-translate/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';
import {SharedModule} from '../shared/shared.module';

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
    ReactiveFormsModule,
    SharedModule
  ],
  entryComponents,
  declarations
})
export class ConfigModule {
}
