import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {MainPageComponent} from './pages/main.page';
import {SongDigitComponent} from './components/song-digit/song-digit.component';
import {SongNumberComponent} from './components/song-number/song-number.component';
import {SelectBookModalComponent} from './components/select-book-modal/select-book-modal.component';
import {IonicModule} from '@ionic/angular';
import {TranslateModule} from '@ngx-translate/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {SharedModule} from '../shared/shared.module';

const entryComponents = [
  SelectBookModalComponent
];

const declarations = [
  ...entryComponents,
  MainPageComponent,
  SongDigitComponent,
  SongNumberComponent
];

const routes: Routes = [
  {
    path: '',
    component: MainPageComponent
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
    IonicModule,
    TranslateModule,
    CommonModule,
    FormsModule,
    SharedModule
  ],
  entryComponents,
  declarations
})
export class MainModule {
}
