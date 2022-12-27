import {Injectable} from '@angular/core';
import {Book, Digit} from '../models';
import {ProxyStorageModel, StorageModel} from '../storage';
import {ChromeCastService} from './chrome-cast.service';

const STORAGE_ID_DIGITS = 'song-number-settings-digits';
const STORAGE_ID_NOTES = 'song-number-settings-notes';
const STORAGE_ID_BOOK = 'song-number-settings-book';
const STORAGE_ID_INFO = 'song-number-settings-info';

const MESSAGE_TYPE_READ = 0;
const MESSAGE_TYPE_SONG = 1;
const MESSAGE_TYPE_INFO = 2;
const MESSAGE_TYPE_CLEAR = 3;

@Injectable({
  providedIn: 'root'
})
export class SongNumberService {

  isPresenting = false;
  digits = new ProxyStorageModel<Digit[]>(STORAGE_ID_DIGITS, [{
    pos: 0,
    value: 0
  }, {
    pos: 1,
    value: 0
  }, {
    pos: 2,
    value: 0
  }]);
  info = new StorageModel<string>(STORAGE_ID_INFO, '')
  notes = new StorageModel<string>(STORAGE_ID_NOTES, '')
  book = new StorageModel<Book>(STORAGE_ID_BOOK, {})

  constructor(protected chromeCastService: ChromeCastService) {
  }

  presentNumber() {
    const message = {
      type: MESSAGE_TYPE_SONG,
      number: this.buildNumber(),
      book: this.book,
      notes: this.notes
    };
    this.chromeCastService.send(message);
    this.isPresenting = true;
  }

  private buildNumber() {
    let result = '';
    let leadingZeros = true;
    for (const obj of this.digits.model) {
      if (obj.value !== 0) {
        leadingZeros = false;
        result += obj.value;
      } else if (!leadingZeros) {
        result += obj.value;
      }
    }
    return result;
  }

  presentInfo() {
    this.chromeCastService.send({
      type: MESSAGE_TYPE_INFO,
      message: this.info
    });
    this.isPresenting = true;
  }

  readPresented() {
    this.chromeCastService.send({
      type: MESSAGE_TYPE_READ
    });
  }

  stopPresentation() {
    this.chromeCastService.send({
      type: MESSAGE_TYPE_CLEAR
    });
    this.isPresenting = false;
  }

  async changeDigitLength(size: number) {
    const digits = [];
    for (let i = 0; i < size; i++) {
      digits.push({
        pos: i,
        value: 0
      });
    }
    this.digits.model = digits
  }
}
