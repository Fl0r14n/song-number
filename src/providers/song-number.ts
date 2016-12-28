import {Injectable} from '@angular/core';
import {Storage} from '@ionic/storage';

interface Digit {
  pos: number;
  value: number;
}

interface Book {
  title: string, description: string, thumb: string, img: string
}

const STORAGE_ID_DIGITS: string = 'song-number-settings-digits';
const STORAGE_ID_NOTES: string = 'song-number-settings-notes';
const STORAGE_ID_BOOK: string = 'song-number-settings-book';
const STORAGE_ID_BOOKS: string = 'song-number-settings-books';
const STORAGE_ID_INFO: string = 'song-number-settings-info';

@Injectable()
export class SongNumberService {

  digits: Digit[];
  private _notes: string;
  private _book: Book;
  books: Book[];
  private _info: string;

  constructor(public storage: Storage) {
    this.storage.get(STORAGE_ID_DIGITS).then(data => {
      if (data) {
        this.digits = data;
      } else {
        this.digits = [{
          pos: 0,
          value: 0
        }, {
          pos: 1,
          value: 0
        }, {
          pos: 2,
          value: 0
        }];
      }
      //make digits observable
      this.digits = this.enhanceArray(this.digits, this.saveDigits.bind(this));
      this.digits = this.observableArray(this.digits, this.saveDigits.bind(this));
    });
    this.storage.get(STORAGE_ID_NOTES).then(data => {
      this._notes = data;
    });
    this.storage.get(STORAGE_ID_BOOK).then(data => {
      this._book = data;
    });
    this.storage.get(STORAGE_ID_BOOKS).then(data => {
      if (data) {
        this.books = data;
      } else {
        this.books = [
          {
            title: 'Caietele negre',
            description: 'Caietele vechi',
            thumb: 'assets/thumb/caiete_negre.jpg',
            img: 'assets/img/'
          },
          {
            title: 'Vrednic este Mielul vol.1',
            description: 'Cartile portocalii',
            thumb: 'assets/thumb/vrednic_este_mielul_1.jpg',
            img: 'assets/img/',
          },
          {
            title: 'Vrednic este Mielul vol.2',
            description: 'Cantari cor de pasti si craciun',
            thumb: 'assets/thumb/vrednic_este_mielul_2.jpg',
            img: 'assets/img/',
          },
          {
            title: 'Caietele albastre',
            description: 'Caietele albastre',
            thumb: 'assets/thumb/caiete_albastre.jpg',
            img: 'assets/img/',
          },
          {
            title: 'Un ospat nesfarsit',
            description: 'Cartea rosie Jubilate',
            thumb: 'assets/thumb/un_ospat_nesfarsit.jpg',
            img: 'assets/img/',
          },
          {
            title: 'Cantarile Evangheliei',
            description: 'Cartile rosii',
            thumb: 'assets/thumb/cantarile_evangheliei_rosii.jpg',
            img: 'assets/img/',
          }
        ];
      }
      //make books observable
      this.books = this.observableArray(this.books, this.saveBooks.bind(this));
    });
    this.storage.get(STORAGE_ID_INFO).then(data => {
      this._info = data;
    });
  }

  showNumber() {
    console.log('Show number');
  }

  showInfo() {
    console.log('Show Info');
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


  //watch for change in digit and save to storage
  private observableObject(value: any, callback?: Function) {
    return new Proxy(value, {
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

  //watch for change in array and save to storage
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
    // unwrap all proxys since there is something wrong with storage
    let buf: Digit[] = [];
    for (let obj of this.digits) {
      buf.push({
        pos: obj.pos,
        value: obj.value
      });
    }
    this.storage.set(STORAGE_ID_DIGITS, buf);
  }
}
