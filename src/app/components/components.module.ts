import {NgModule} from '@angular/core';
import {SongDigitComponent} from './song-digit/song-digit.component';
import {SongNumberComponent} from './song-number/song-number.component';
import {IonicModule} from '@ionic/angular';
import {CommonModule} from '@angular/common';

@NgModule({
  imports: [
    CommonModule,
    IonicModule
  ],
  declarations: [
    SongDigitComponent,
    SongNumberComponent
  ],
  exports: [
    SongDigitComponent,
    SongNumberComponent
  ]
})
export class ComponentsModule {}
