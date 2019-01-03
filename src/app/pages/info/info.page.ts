import {AfterViewInit, Component} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {CastPage} from '../cast-page';
import {SongNumberService} from '../../services/song-number.service';
import {ChromeCastService} from '../../services/chrome-cast.service';

@Component({
  selector: 'info-page',
  templateUrl: 'info.page.html',
  styleUrls: ['info.page.scss']
})
export class InfoPageComponent extends CastPage {

  constructor(chromeCastService: ChromeCastService,
              private songNumberService: SongNumberService,
              private i18nService: TranslateService) {
    super(chromeCastService);
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
