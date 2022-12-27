import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {catchError, combineLatestAll, EMPTY, from, shareReplay} from 'rxjs';
import {map} from 'rxjs/operators';
import {environment} from '../../../environments/environment';
import {Book, BookCollection, BookResourceCollection, Language} from '../models';
import {ProxyStorageModel, StorageModel} from '../storage';
import {LoggerService} from './logger.service';

const STORAGE_ID_COLLECTIONS = 'song-number-settings-collection';
const STORAGE_ID_DOWNLOADS = 'song-number-settings-downloads';

const {downloads} = environment;

@Injectable({
  providedIn: 'root'
})
export class SongBooksService {

  endpoint = new StorageModel<string>(STORAGE_ID_DOWNLOADS, downloads)
  collections = new ProxyStorageModel<BookCollection[]>(STORAGE_ID_COLLECTIONS, []);
  /**
   * Default book cover.
   */
  defaultCover$ = this.http.get<Book>('assets/json/cover.json').pipe(
    shareReplay(1)
  )

  constructor(protected http: HttpClient,
              protected log: LoggerService) {
  }

  /**
   * get the remote languages which contain collections
   */
  get languages$() {
    return this.http.get<Language[]>(`${this.endpoint.model}/languages.json`).pipe(
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
    return this.http.get<BookResourceCollection[]>(`${this.endpoint.model}/index/${lang}/collections.json`).pipe(
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
      map(path => this.http.get<BookCollection[]>(`${this.endpoint.model}${path}`)),
      combineLatestAll(),
      map(v => v.reduce((a, b) => [...a, ...b]))
    );
  }

  /**
   * Create an empty collection
   * @param collection book collection
   */
  addCollection(collection: BookCollection) {
    // so that collection is observable like when changing collection name
    this.collections.model = [...this.collections.model, collection]
  }

  /**
   * Add a book to the collection
   * @param data
   * @param collectionName
   */
  addBook(data: Book, collectionName: string) {
    const collection = this.collections.model.find(c => c.name === collectionName);
    if (collection) {
      if (!collection.books || collection.books.length === undefined) {
        collection.books = []
      }
      collection.books.push(data)
      // force observable
      this.collections.model = this.collections.model
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
