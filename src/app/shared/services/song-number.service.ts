import {Injectable} from '@angular/core';
import {ChromeCastService} from './chrome-cast.service';
import {noop} from 'rxjs';
import {StorageService} from './storage.service';
import {Book, BookCollection, Digit, proxify, unproxify} from '../../index';

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
  digits: Digit[] = [];

  private _info: string | undefined;
  private _notes: string | undefined;
  private _book: Book | undefined;

  constructor(private storage: StorageService,
              private chromeCastService: ChromeCastService) {
    this.init().then(noop, noop);
  }

  async init() {
    let digits = await this.storage.get(STORAGE_ID_DIGITS);
    digits = digits || [{
      pos: 0,
      value: 0
    }, {
      pos: 1,
      value: 0
    }, {
      pos: 2,
      value: 0
    }];
    // make digits observable
    this.digits = proxify(digits, this.saveDigits);
    this._notes = await this.storage.get(STORAGE_ID_NOTES);
    this._book = await this.storage.get(STORAGE_ID_BOOK);
    this._info = await this.storage.get(STORAGE_ID_INFO);
  }

  saveDigits = () => this.storage.set(STORAGE_ID_DIGITS, unproxify(this.digits));

  presentNumber() {
    const message = {
      type: MESSAGE_TYPE_SONG,
      number: this.buildNumber(),
      book: unproxify(this.book),
      notes: this.notes
    };
    this.chromeCastService.send(message);
    this.isPresenting = true;
  }

  private buildNumber(): string {
    let result = '';
    let leadingZeros = true;
    for (const obj of this.digits) {
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
    await this.storage.set(STORAGE_ID_DIGITS, digits);
    this.digits = proxify(digits, this.saveDigits);
  }

  get notes(): string {
    return this._notes || '';
  }

  set notes(value: string) {
    this._notes = value;
    this.storage.set(STORAGE_ID_NOTES, value);
  }

  get book(): Book {
    return this._book || {};
  }

  set book(value: Book) {
    this._book = value;
    this.storage.set(STORAGE_ID_BOOK, unproxify(value));
  }

  get info(): string {
    return this._info || '';
  }

  set info(value: string) {
    this._info = value;
    this.storage.set(STORAGE_ID_INFO, value);
  }
}
