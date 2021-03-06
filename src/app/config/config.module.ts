import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {ConfigPageComponent} from './pages/config.page';
import {IonicModule} from '@ionic/angular';
import {TranslateModule} from '@ngx-translate/core';
import {FormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';


const declarations = [
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
  ],
  declarations
})
export class ConfigModule {
}
