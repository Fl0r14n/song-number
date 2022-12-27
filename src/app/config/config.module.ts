import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {RouterModule, Routes} from '@angular/router';
import {IonicModule} from '@ionic/angular';
import {TranslateModule} from '@ngx-translate/core';
import {ImportModalComponent} from './components/import-modal.component';
import {ConfigPageComponent} from './pages/config.page';

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
  declarations: [
    ConfigPageComponent,
    ImportModalComponent
  ]
})
export class ConfigModule {
}
