import {Injectable} from '@angular/core';
import {SongBooksService} from './song-books.service';
import {ChromeCastService} from './chrome-cast.service';
import {Book, BookCollection, Digit} from '../models/api';
import {Storage} from '@ionic/storage';
import {noop} from 'rxjs';

const STORAGE_ID_DIGITS = 'song-number-settings-digits';
const STORAGE_ID_NOTES = 'song-number-settings-notes';
const STORAGE_ID_BOOK = 'song-number-settings-book';
const STORAGE_ID_COLLECTIONS = 'song-number-settings-collection';
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
  collections: BookCollection[];

  // tslint:disable-next-line:variable-name
  private _info: string;
  // tslint:disable-next-line:variable-name
  private _notes: string;
  // tslint:disable-next-line:variable-name
  private _book: Book;

  constructor(private songBooksService: SongBooksService,
              private storage: Storage,
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
    this.initCollections();
    this._info = await this.storage.get(STORAGE_ID_INFO);
  }

  async initCollections() {
    let collections = await this.storage.get(STORAGE_ID_COLLECTIONS);
    if (!collections || collections.length === undefined || collections.length === 0) {
      collections = await this.songBooksService.getCollections().toPromise();
      await this.storage.set(STORAGE_ID_COLLECTIONS, collections);
    }
    this.collections = proxify(collections, this.saveCollection);
  }

  saveCollection = () => this.storage.set(STORAGE_ID_COLLECTIONS, unproxify(this.collections));
  saveDigits = () => this.storage.set(STORAGE_ID_DIGITS, unproxify(this.digits));

  addCollection(name) {
    this.collections.push(proxify({
      name,
    }, this.saveCollection));
  }

  addBook(data: Book, collectionName: string) {
    const collections = unproxify(this.collections);
    const collection = collections.find(c => c.name === collectionName);
    if (!collection.books || collection.books.length === undefined) {
      collection.books = [];
    }
    collection.books.push(data);
    this.collections = proxify(collections, this.saveCollection);
  }

  editBook(oldBook: Book, newBook: Book) {
    Object.assign(oldBook, newBook);
  }

  deleteBook(book: Book, collection: BookCollection) {
    const idx = collection.books.findIndex(i => i.title === book.title && i.description === book.description);
    if (idx > -1) {
      collection.books.splice(idx, 1);
    }
  }

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
    this.storage.set(STORAGE_ID_BOOK, unproxify(value));
  }

  get info(): string {
    return this._info;
  }

  set info(value: string) {
    this._info = value;
    this.storage.set(STORAGE_ID_INFO, value);
  }
}

const proxify = (value: any, callback?: (object) => any) => {
  if (typeof value === 'object') {
    for (const key of Object.keys(value)) {
      if (value[key] != null) {
        value[key] = proxify(value[key], callback);
      }
    }
    return new Proxy(value, {
      get: (target, property) => {
        if (property === 'length') {
          return value.length;
        }
        return target[property];
      },
      set: (target, property, val) => {
        target[property] = val;
        if (callback) {
          callback(target);
        }
        return true;
      }
    });
  } else {
    return value;
  }
};

const unproxify = (value) => {
  if (typeof value === 'object') {
    if (value == null) {
      return null;
    }
    const obj = value.length ? [] : {};
    for (const key of Object.keys(value)) {
      obj[key] = unproxify(value[key]);
    }
    return obj;
  } else {
    return value;
  }
};
