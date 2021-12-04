import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable, of, switchMap} from 'rxjs';
import {StorageService} from './storage.service';
import {environment} from '../../../environments/environment';
import {Book, BookResourceCollection} from '../../index';

const STORAGE_ID_DOWNLOADS = 'song-number-settings-downloads';

const {downloads} = environment;

@Injectable({
  providedIn: 'root'
})
export class SongBooksService {

  constructor(private http: HttpClient,
              private storage: StorageService) {
  }

  async setEndpoint(path: string) {
    this.storage.set(STORAGE_ID_DOWNLOADS, path || downloads);
  }

  async getEndpoint() {
    return this.storage.get(STORAGE_ID_DOWNLOADS);
  }

  getCollections$(lang: string): Observable<BookResourceCollection[]> {
    return of(this.getEndpoint()).pipe(
      switchMap(url => this.http.get<BookResourceCollection[]>(`${url}/index/${lang}/collections.json`))
    );
  }


  // getCollections$(): Observable<BookCollection[]> {
  //   return this.http.get<BookCollection[]>('assets/json/collection.json');
  // }

  getCover$(): Observable<Book> {
    return this.http.get<Book>('assets/json/cover.json');
  }
}
