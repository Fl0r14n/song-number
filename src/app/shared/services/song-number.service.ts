import {Injectable} from '@angular/core';
import {BehaviorSubject, distinctUntilChanged, shareReplay, switchMap} from 'rxjs';
import {map} from 'rxjs/operators';
import {Book, Digit} from '../models';
import {ProxyStorageModel, StorageModel} from '../storage';
import {ChromeCastService, ChromeCastState} from './chrome-cast.service';

const STORAGE_ID_DIGITS = 'song-number-settings-digits';
const STORAGE_ID_NOTES = 'song-number-settings-notes';
const STORAGE_ID_BOOK = 'song-number-settings-book';
const STORAGE_ID_INFO = 'song-number-settings-info';

const MESSAGE_TYPE_READ = 0;
const MESSAGE_TYPE_SONG = 1;
const MESSAGE_TYPE_INFO = 2;
const MESSAGE_TYPE_CLEAR = 3;

export interface PresentButton {
  icon: string;
  color: string;
  disabled: boolean;
  presenting: boolean
}

@Injectable({
  providedIn: 'root'
})
export class SongNumberService {

  message$ = this.chromeCastService.message$
  state$ = this.chromeCastService.state$
  #present$ = new BehaviorSubject<boolean>(false);
  isPresenting$ = this.#present$.pipe(
    distinctUntilChanged(),
    switchMap(present => this.state$.pipe(
      map(state => state === ChromeCastState.CONNECTED && present)
    )),
    shareReplay(1)
  )
  presentButton$ = this.isPresenting$.pipe(
    map(presenting => {
      const disabled = !this.isConnected(this.chromeCastService.state)
      return {
        presenting,
        disabled,
        icon: presenting && 'square' || 'play',
        color: presenting && 'danger' || 'primary',
      } as PresentButton
    }),
    shareReplay(1)
  )
  castButton$ = this.state$.pipe(
    map(state => ({
      disabled: !this.isInitialized(state),
      color: this.isConnected(state) && 'secondary' || 'primary',
      icon: 'assets/icon/cast-icon.svg'
    })),
    shareReplay(1)
  )
  presentedButton$ = this.state$.pipe(
    map(state => ({
      disabled: !this.isConnected(state),
      color: 'secondary',
      icon: 'information'
    })),
    shareReplay(1)
  )

  digits = new ProxyStorageModel<Digit[]>(STORAGE_ID_DIGITS, [{
    pos: 0,
    value: 0
  }, {
    pos: 1,
    value: 0
  }, {
    pos: 2,
    value: 0
  }]);
  info = new StorageModel<string>(STORAGE_ID_INFO, '')
  notes = new StorageModel<string>(STORAGE_ID_NOTES, '')
  book = new StorageModel<Book>(STORAGE_ID_BOOK, {})

  set digitsLength(size: number) {
    const digits = [];
    for (let i = 0; i < size; i++) {
      digits.push({
        pos: i,
        value: 0
      });
    }
    this.digits.model = digits
  }

  get number() {
    let result = '';
    let leadingZeros = true;
    for (const obj of this.digits.model) {
      if (obj.value !== 0) {
        leadingZeros = false;
        result += obj.value;
      } else if (!leadingZeros) {
        result += obj.value;
      }
    }
    return result;
  }

  constructor(protected chromeCastService: ChromeCastService) {
  }

  presentNumber() {
    if (this.#present$.getValue()) {
      return this.clear()
    }
    const message = {
      type: MESSAGE_TYPE_SONG,
      number: this.number,
      book: this.book.model,
      notes: this.notes.model
    };
    this.chromeCastService.send(message);
    this.#present$.next(true);
  }

  presentInfo() {
    if (this.#present$.getValue()) {
      return this.clear()
    }
    this.chromeCastService.send({
      type: MESSAGE_TYPE_INFO,
      message: this.info.model
    });
    this.#present$.next(true);
  }

  readPresented() {
    this.chromeCastService.send({
      type: MESSAGE_TYPE_READ
    });
  }

  protected clear() {
    this.chromeCastService.send({
      type: MESSAGE_TYPE_CLEAR
    });
    this.#present$.next(false)
  }

  cast() {
    if (this.isConnected(this.chromeCastService.state)) {
      this.#present$.next(false)
      this.chromeCastService.close();
    } else {
      this.chromeCastService.open();
    }
  }

  isInitialized(state: ChromeCastState) {
    return (state & ChromeCastState.INITIALIZED) === ChromeCastState.INITIALIZED;
  }

  isConnected(state: ChromeCastState) {
    return (state & ChromeCastState.CONNECTED) === ChromeCastState.CONNECTED;
  }
}
