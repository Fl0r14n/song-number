import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {Book} from '../models/api';

@Injectable({
  providedIn: 'root'
})
export class SongBooksService {

  constructor(private http: HttpClient) {
  }

  getDefaultSongBooks(): Observable<Book[]> {
    return this.http.get<Book[]>('assets/json/song-books.json');
  }

  getCoverBook(): Observable<Book> {
    return this.http.get<Book>('assets/json/cover-book.json');
  }
}
