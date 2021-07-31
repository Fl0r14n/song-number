import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {Book, BookCollection} from '../models/api';

@Injectable({
  providedIn: 'root'
})
export class SongBooksService {

  constructor(private http: HttpClient) {
  }

  getCollections$(): Observable<BookCollection[]> {
    return this.http.get<BookCollection[]>('assets/json/collection.json');
  }

  getCover$(): Observable<Book> {
    return this.http.get<Book>('assets/json/cover.json');
  }
}
