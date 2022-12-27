import {Component} from '@angular/core';
import {ModalController} from '@ionic/angular';
import {BookResourceCollection, Language} from '../../shared/models';
import {LoggerService, SongBooksService} from '../../shared/services';

@Component({
  selector: 'import-modal',
  template: `
    <ion-header>
      <ion-toolbar>
        <ion-title class="ion-text-center">
          {{'pages.importModal.title' | translate}}
        </ion-title>
        <ion-buttons slot="end">
          <ion-button color="primary" (click)="dismiss()">
            <ion-icon slot="icon-only" name="close-circle"></ion-icon>
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">
      <ion-list>
        <ion-list-header>{{'pages.importModal.languageHeader' | translate}}</ion-list-header>
        <ion-item>
          <ion-label>{{'pages.importModal.language' | translate}}</ion-label>
          <ion-select [(ngModel)]="language">
            <ion-select-option *ngFor="let value of languages" [value]="value">{{value.name}}</ion-select-option>
          </ion-select>
        </ion-item>
      </ion-list>

      <ion-list *ngIf="index">
        <ion-list-header>{{'pages.importModal.collectionsHeader' | translate}}</ion-list-header>
        <ion-item *ngFor="let idx of index">
          <ion-label>
            <h2>{{idx.name}}</h2>
            <p>{{idx.description}}</p>
          </ion-label>
          <ion-avatar>
            <img [src]="idx.thumb" *ngIf="idx.thumb" alt="id-thumb">
          </ion-avatar>
          <ion-checkbox slot="start" [(ngModel)]="idx.selected"></ion-checkbox>
        </ion-item>

        <ion-button expand="block"
                    color="primary"
                    [disabled]="!hasSelection()"
                    (click)="import()">{{'pages.importModal.submit' | translate}}</ion-button>
      </ion-list>
    </ion-content>
  `
})
export class ImportModalComponent {

  private _language: Language = {};
  languages: Language[] | undefined;
  index: BookResourceCollection[] | undefined;

  constructor(private modalController: ModalController,
              private songBooksService: SongBooksService,
              private log: LoggerService) {
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
    this.songBooksService.getCollections$([...paths]).subscribe(collections => collections.forEach(collection => this.songBooksService.addCollection(collection)));
    await this.dismiss();
  }
}
