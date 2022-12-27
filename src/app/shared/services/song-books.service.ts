import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {catchError, combineLatestAll, EMPTY, from, noop, shareReplay} from 'rxjs';
import {map} from 'rxjs/operators';
import {environment} from '../../../environments/environment';
import {Book, BookCollection, BookResourceCollection, Language, proxify, unproxify} from '../../index';
import {LoggerService} from './logger.service';
import {StorageService} from './storage.service';

const STORAGE_ID_COLLECTIONS = 'song-number-settings-collection';
const STORAGE_ID_DOWNLOADS = 'song-number-settings-downloads';

const {downloads} = environment;

@Injectable({
  providedIn: 'root'
})
export class SongBooksService {

  #endpoint = '';
  #saveCollection = () => this.storage.set(STORAGE_ID_COLLECTIONS, unproxify(this.collections));
  collections: BookCollection[] = [];
  defaultCover$ = this.http.get<Book>('assets/json/cover.json').pipe(
    shareReplay(1)
  )

  constructor(private http: HttpClient,
              private storage: StorageService,
              private log: LoggerService) {
    this.init().then(noop, noop);
  }

  protected async init() {
    this.#endpoint = await this.storage.get(STORAGE_ID_DOWNLOADS) || downloads;
    let collections = await this.storage.get(STORAGE_ID_COLLECTIONS);
    if (!collections || collections.length === undefined || collections.length === 0) {
      collections = [];
    }
    this.collections = proxify(collections, this.#saveCollection);
  }

  get endpoint() {
    return this.#endpoint;
  }

  set endpoint(endpoint: string) {
    this.#endpoint = endpoint || downloads;
    this.storage.set(STORAGE_ID_DOWNLOADS, this.#endpoint).then();
  }

  /**
   * get the remote languages which contain collections
   */
  get languages$() {
    return this.http.get<Language[]>(`${this.endpoint}/languages.json`).pipe(
      catchError(err => {
        this.log.error(err.message);
        return EMPTY;
      })
    );
  }

  /**
   * Get the index which contain the possible collections
   * @param lang: language code
   */
  getIndex$(lang: string) {
    return this.http.get<BookResourceCollection[]>(`${this.endpoint}/index/${lang}/collections.json`).pipe(
      catchError(err => {
        this.log.error(err.message);
        return EMPTY;
      })
    );
  }

  /**
   * Get the collections from the index based on the paths array and merge them
   * @param paths: url resource paths
   */
  getCollections$(paths: string[]) {
    return from(paths).pipe(
      catchError(err => {
        this.log.error(err.message);
        return EMPTY;
      }),
      map(path => this.http.get<BookCollection[]>(`${this.endpoint}${path}`)),
      combineLatestAll(),
      map(v => v.reduce((a, b) => [...a, ...b]))
    );
  }

  /**
   * Default book cover.
   */


  /**
   * Create an empty collection
   * @param collection book collection
   */
  addCollection(collection: BookCollection) {
    this.collections.push(proxify(collection, this.#saveCollection));
  }

  /**
   * Add a book to the collection
   * @param data
   * @param collectionName
   */
  addBook(data: Book, collectionName: string) {
    const collection = this.collections.find(c => c.name === collectionName);
    if (collection) {
      if (!collection.books || collection.books.length === undefined) {
        collection.books = proxify([], this.#saveCollection);
      }
      collection.books?.push(proxify(data, this.#saveCollection));
    }
  }

  /**
   * Edit existing book
   * @param oldBook
   * @param newBook
   */
  editBook(oldBook: Book, newBook: Book) {
    Object.assign(oldBook, newBook);
  }

  /**
   * Delete a book from the collection
   * @param book
   * @param collection
   */
  deleteBook(book: Book, collection: BookCollection) {
    if (collection.books) {
      const idx = collection.books.findIndex(i => i.title === book.title && i.description === book.description);
      if (idx > -1) {
        collection.books.splice(idx, 1);
      }
    }
  }
}
