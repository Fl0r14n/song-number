import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {InfoPageComponent} from './pages/info.page';
import {IonicModule} from '@ionic/angular';
import {TranslateModule} from '@ngx-translate/core';
import {FormsModule} from '@angular/forms';
import {SharedModule} from '../shared/shared.module';

const declarations = [
  InfoPageComponent
];

const routes: Routes = [
  {
    path: '',
    component: InfoPageComponent
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
    IonicModule,
    TranslateModule,
    FormsModule,
    SharedModule
  ],
  declarations
})
export class InfoModule {
}
