import {AfterViewInit, Component} from '@angular/core';
import {SongNumberService} from  '../../providers/song-number';
import {ChromecastService} from '../../providers/chromecast';
import {TranslateService} from 'ng2-translate';
import {CastPage} from '../cast-page';

@Component({
  selector: 'page-info',
  templateUrl: 'info.html'
})
export class InfoPage extends CastPage implements AfterViewInit {

  constructor(i18nService: TranslateService, public songNumberService: SongNumberService, public chromecastService: ChromecastService) {
    super(i18nService, chromecastService);
    i18nService.get(['pages.info.startPresenting', 'pages.info.stopPresenting']).subscribe((value) => {
      this.i18n = value;
      this.presentButtonON.text = this.i18n['pages.info.stopPresenting'];
      this.presentButtonOFF.text = this.i18n['pages.info.startPresenting'];
    });
  }

  present() {
    if (!this.songNumberService.isPresenting) {
      this.songNumberService.presentInfo();
      this.presentButton = this.presentButtonON;
    } else {
      this.songNumberService.stopPresentaion();
      this.presentButton = this.presentButtonOFF;
    }
  }

  ngAfterViewInit(): void {
    // reinit button state
    if (this.songNumberService.isPresenting) {
      this.presentButton = this.presentButtonON;
    } else {
      this.presentButton = this.presentButtonOFF;
    }
  }
}
