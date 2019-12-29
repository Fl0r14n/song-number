import {Component} from '@angular/core';
import {CastPage} from '../../shared/abstract/cast-page';
import {ChromeCastService} from '../../shared/services/chrome-cast.service';
import {SongNumberService} from '../../shared/services/song-number.service';

@Component({
  selector: 'info-page',
  templateUrl: 'info.page.html',
  styleUrls: ['info.page.scss']
})
export class InfoPageComponent extends CastPage {

  constructor(chromeCastService: ChromeCastService,
              private songNumberService: SongNumberService) {
    super(chromeCastService);
  }

  get info() {
    return this.songNumberService.info;
  }

  set info(info) {
    this.songNumberService.info = info;
  }

  present() {
    if (!this.songNumberService.isPresenting) {
      this.songNumberService.presentInfo();
      CastPage.presentButton = CastPage.presentButtonON;
    } else {
      this.songNumberService.stopPresentation();
      CastPage.presentButton = CastPage.presentButtonOFF;
    }
  }
}
