import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {RouterModule} from '@angular/router';
import {IonicModule} from '@ionic/angular';
import {TranslateModule} from '@ngx-translate/core';
import {InfoPageComponent} from './pages/info.page';

@NgModule({
  imports: [
    RouterModule.forChild([{
      path: '',
      component: InfoPageComponent
    }]),
    IonicModule,
    TranslateModule,
    FormsModule,
    CommonModule
  ],
  declarations: [
    InfoPageComponent
  ]
})
export class InfoModule {
}
