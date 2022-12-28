import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {RouterModule} from '@angular/router';
import {IonicModule} from '@ionic/angular';
import {TranslateModule} from '@ngx-translate/core';
import {SelectBookModalComponent} from './components/select-book-modal.component';
import {SongDigitComponent} from './components/song-digit.component';
import {SongNumberComponent} from './components/song-number.component';
import {MainPageComponent} from './pages/main.page';

@NgModule({
  imports: [
    RouterModule.forChild([{
      path: '',
      component: MainPageComponent
    }]),
    IonicModule,
    TranslateModule,
    CommonModule,
    FormsModule
  ],
  declarations: [
    MainPageComponent,
    SongDigitComponent,
    SongNumberComponent,
    SelectBookModalComponent
  ]
})
export class MainModule {
}
