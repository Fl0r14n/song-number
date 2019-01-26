import {Injectable} from '@angular/core';
import {Book, Digit} from './types/api';
import {SongBooksService} from './song-books.service';
import {ChromeCastService} from './chrome-cast.service';
import {Storage} from '@ionic/storage';

const STORAGE_ID_DIGITS = 'song-number-settings-digits';
const STORAGE_ID_NOTES = 'song-number-settings-notes';
const STORAGE_ID_BOOK = 'song-number-settings-book';
const STORAGE_ID_BOOKS = 'song-number-settings-books';
const STORAGE_ID_INFO = 'song-number-settings-info';

const MESSAGE_TYPE_READ = 0;
const MESSAGE_TYPE_SONG = 1;
const MESSAGE_TYPE_INFO = 2;
const MESSAGE_TYPE_CLEAR = 3;

@Injectable()
export class SongNumberService {

  isPresenting = false;
  digits: Digit[] = [];
  books: Book[];
  private _info: string;
  private _notes: string;
  private _book: Book;

  constructor(private songBooksService: SongBooksService,
              private storage: Storage,
              private chromeCastService: ChromeCastService) {
    this.init();
  }

  async init() {
    this.digits = await this.storage.get(STORAGE_ID_DIGITS);
    this.digits = this.digits || [{
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
    this.digits = this.enhanceArray(this.digits, this.saveDigits.bind(this));
    this.digits = this.observableArray(this.digits, this.saveDigits.bind(this));
    this._notes = await this.storage.get(STORAGE_ID_NOTES);
    this._book = await this.storage.get(STORAGE_ID_BOOK);
    this.books = await this.storage.get(STORAGE_ID_BOOKS);
    if (!this.books || this.books.length === 0) {
      this.books = await this.songBooksService.getDefaultSongBooks().toPromise();
    }
    // make books observable
    this.books = this.observableArray(this.books, this.saveBooks.bind(this));
    this._info = await this.storage.get(STORAGE_ID_INFO);
  }

  presentNumber() {
    const number = this.buildNumber();
    this.chromeCastService.send({
      type: MESSAGE_TYPE_SONG,
      number: number,
      book: this.book,
      notes: this.notes
    });
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

  changeDigitLength(size: number) {
    this.digits = this.observableArray([], this.saveDigits.bind(this));
    for (let i = 0; i < size; i++) {
      this.digits.push(this.observableObject({
        pos: i,
        value: 0
      }, this.saveDigits.bind(this)));
    }
  }

  get notes(): string {
    return this._notes;
  }

  set notes(value: string) {
    this._notes = value;
    this.storage.set(STORAGE_ID_NOTES, value);
  }

  get book(): Book {
    return this._book;
  }

  set book(value: Book) {
    this._book = value;
    this.storage.set(STORAGE_ID_BOOK, value);
  }

  get info(): string {
    return this._info;
  }

  set info(value: string) {
    this._info = value;
    this.storage.set(STORAGE_ID_INFO, value);
  }


  // watch for change in digit and save to storage
  private observableObject(val: any, callback?: Function) {
    return new Proxy(val, {
      get: (target, property) => {
        return target[property];
      },
      set: (target, property, value) => {
        target[property] = value;
        if (callback) {
          callback(target);
        }
        return true;
      }
    });
  }

  // watch for change in array and save to storage
  private observableArray(array: any[], callback?: Function) {
    return new Proxy(array, {
      get: (target, property) => {
        return target[property];
      },
      set: (target, property, value) => {
        target[property] = value;
        if (property === 'length' && callback) {
          callback(target);
        }
        return true;
      }
    });
  }

  private enhanceArray(arr: any[], callback?: Function): any[] {
    for (let i = 0; i < arr.length; i++) {
      arr[i] = this.observableObject(arr[i], callback);
    }
    return arr;
  }

  private saveBooks(books: any[]) {
    this.storage.set(STORAGE_ID_BOOKS, books);
  }

  private saveDigits() {
    // unwrap all proxy's since there is something wrong with storage
    const buf: Digit[] = [];
    for (const obj of this.digits) {
      buf.push({
        pos: obj.pos,
        value: obj.value
      });
    }
    this.storage.set(STORAGE_ID_DIGITS, buf);
  }
}
