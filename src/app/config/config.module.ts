import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {RouterModule} from '@angular/router';
import {IonicModule} from '@ionic/angular';
import {TranslateModule} from '@ngx-translate/core';
import {ImportModalComponent} from './components/import-modal.component';
import {ConfigPageComponent} from './pages/config.page';

@NgModule({
  imports: [
    RouterModule.forChild([{
      path: '',
      component: ConfigPageComponent
    }]),
    IonicModule,
    TranslateModule,
    FormsModule,
    CommonModule,
  ],
  declarations: [
    ConfigPageComponent,
    ImportModalComponent
  ]
})
export class ConfigModule {
}
