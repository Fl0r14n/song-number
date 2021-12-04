import {Component} from '@angular/core';
import {ModalController} from '@ionic/angular';
import {SongBooksService} from '../../../shared/services/song-books.service';
import {BookResourceCollection, Language} from '../../../index';

@Component({
  selector: 'import-modal',
  templateUrl: 'import-modal.component.html'
})
export class ImportModalComponent {

  private _language: Language = {};
  languages: Language[] | undefined;
  index: BookResourceCollection[] | undefined;

  constructor(private modalController: ModalController,
              private songBooksService: SongBooksService) {
    // cuz of some bug when using async pipe in ionic modal
    this.songBooksService.languages$.subscribe(langs => this.languages = langs);
  }

  async dismiss() {
    await this.modalController.dismiss();
  }

  get language() {
    return this._language;
  }

  set language(language: Language) {
    this._language = language;
    this._language.code && this.songBooksService.getIndex$(this._language.code).subscribe(index => this.index = index);
  }

  hasSelection() {
    return !!this.index?.find(idx => idx.selected);
  }

  async import() {
    let paths = new Set(this.index?.filter(v => v.selected).map(v => v.paths).reduce((a, b) => [...a, ...b], []));
    this.songBooksService.getCollections$([...paths]).subscribe(v => console.log(v));
    // await this.dismiss();
  }
}
