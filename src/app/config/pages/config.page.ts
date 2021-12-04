import {Component} from '@angular/core';
import {SongNumberService} from '../../shared/services/song-number.service';
import {LoggerService, LogLevel} from '../../shared/services/logger.service';

@Component({
  selector: 'config-page',
  templateUrl: 'config.page.html'
})
export class ConfigPageComponent {

  possibleDigits: number[] = [1, 2, 3, 4, 5];

  constructor(private songNumberService: SongNumberService,
              private log: LoggerService) {
  }

  get digitLength(): number {
    return this.songNumberService.digits.length;
  }

  set digitLength(value: number) {
    this.songNumberService.changeDigitLength(value);
  }

  get debug(): boolean {
    return this.log.logLevel === LogLevel.DEBUG;
  }

  set debug(value: boolean) {
    this.log.logLevel = value ? LogLevel.DEBUG : LogLevel.INFO;
  }

  importCollection() {
    //TODO
  }
}
