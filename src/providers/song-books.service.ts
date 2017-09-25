import {Injectable} from '@angular/core';
import {Http} from '@angular/http';
import {Observable} from 'rxjs/Observable';
import {Book} from './types/api';

@Injectable()
export class SongBooksService {

  constructor(protected http: Http) {
  }

  getDefaultSongBooks(): Observable<Book[]> {
    return this.http.get('/assets/json/song-books.json').map(res => res.json());
  }

  getCoverBook(): Observable<Book> {
    return this.http.get('/assets/json/cover-book.json').map(res => res.json());
  }
}
