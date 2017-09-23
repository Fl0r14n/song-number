import {NgModule} from '@angular/core';
import {SongDigitComponent} from './song-digit/song-digit.component';
import {SongNumberComponent} from './song-number/song-number.component';

@NgModule({
  imports: [],
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
