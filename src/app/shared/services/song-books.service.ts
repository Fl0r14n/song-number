import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {combineLatestAll, from, Observable, of, reduce, switchMap, tap, zip} from 'rxjs';
import {StorageService} from './storage.service';
import {environment} from '../../../environments/environment';
import {Book, BookCollection, BookResourceCollection, Language} from '../../index';
import {map} from 'rxjs/operators';

const STORAGE_ID_DOWNLOADS = 'song-number-settings-downloads';

const {downloads} = environment;

@Injectable({
  providedIn: 'root'
})
export class SongBooksService {

  private _endpoint = '';

  constructor(private http: HttpClient,
              private storage: StorageService) {
    this.init().then();
  }

  protected async init() {
    this._endpoint = await this.storage.get(STORAGE_ID_DOWNLOADS) || downloads;
  }

  get endpoint() {
    return this._endpoint;
  }

  set endpoint(endpoint: string) {
    this._endpoint = endpoint || downloads;
    this.storage.set(STORAGE_ID_DOWNLOADS, this._endpoint).then();
  }

  /**
   * get the remote languages which contain collections
   */
  get languages$(): Observable<Language[]> {
    return this.http.get<Language[]>(`${this.endpoint}/languages.json`);
  }

  /**
   * Get the index which contain the possible collections
   * @param lang: language code
   */
  getIndex$(lang: string): Observable<BookResourceCollection[]> {
    return this.http.get<BookResourceCollection[]>(`${this.endpoint}/index/${lang}/collections.json`);
  }

  /**
   * Get the collections from the index based on the paths array and merge them
   * @param paths: url resource paths
   */
  getCollections$(paths: string[]): Observable<BookCollection[]> {
    return from(paths).pipe(
      map(path => this.http.get<BookCollection[]>(`${this.endpoint}${path}`)),
      combineLatestAll(),
      map(v => v.reduce((a, b) => [...a, ...b]))
    );
  }

  getCover$(): Observable<Book> {
    return this.http.get<Book>('assets/json/cover.json');
  }
}
