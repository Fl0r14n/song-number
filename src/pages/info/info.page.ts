import {AfterViewInit, Component} from '@angular/core';
import {TranslateService} from 'ng2-translate';
import {CastPage} from '../cast-page';
import {SongNumberService} from '../../providers/song-number.service';
import {ChromecastService} from '../../providers/chromecast.service';

@Component({
  selector: 'page-info',
  templateUrl: 'info.page.html'
})
export class InfoPage extends CastPage implements AfterViewInit {

  constructor(i18nService: TranslateService,
              protected songNumberService: SongNumberService,
              protected chromecastService: ChromecastService) {
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
    // reinitialize button state
    if (this.songNumberService.isPresenting) {
      this.presentButton = this.presentButtonON;
    } else {
      this.presentButton = this.presentButtonOFF;
    }
  }
}
