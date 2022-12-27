import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {RouterModule, Routes} from '@angular/router';
import {IonicModule} from '@ionic/angular';
import {TranslateModule} from '@ngx-translate/core';
import {InfoPageComponent} from './pages/info.page';

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
    CommonModule
  ],
  declarations: [
    InfoPageComponent
  ]
})
export class InfoModule {
}
