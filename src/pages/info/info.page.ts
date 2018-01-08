import {AfterViewInit, Component, OnInit} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {ChromecastService} from '../../providers/chromecast.service';
import {SongNumberService} from '../../providers/song-number.service';
import {CastPage} from '../cast-page';

@Component({
  selector: 'page-info',
  templateUrl: 'info.page.html'
})
export class InfoPage extends CastPage implements OnInit, AfterViewInit {

  constructor(protected i18nService: TranslateService,
              private songNumberService: SongNumberService,
              protected chromecastService: ChromecastService) {
    super(i18nService, chromecastService);
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

  ngOnInit(): void {
    this.i18nService.get(['pages.info.startPresenting', 'pages.info.stopPresenting']).subscribe((value) => {
      this.i18n = value;
      this.presentButtonON.text = this.i18n['pages.info.stopPresenting'];
      this.presentButtonOFF.text = this.i18n['pages.info.startPresenting'];
    });
  }
}
