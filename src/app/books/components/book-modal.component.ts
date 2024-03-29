import {Component, OnInit} from '@angular/core';
import {UntypedFormControl, UntypedFormGroup, Validators} from '@angular/forms';
import {CameraSource} from '@capacitor/camera';
import {ModalController} from '@ionic/angular';
import {Book, BookCollection} from '../../shared/models';
import {CameraService, SongBooksService} from '../../shared/services';

@Component({
  selector: 'book-modal',
  template: `
    <ion-header>
      <ion-toolbar>
        <ion-title class="ion-text-center">
          {{(editMode ? 'pages.bookModal.edit.title' : 'pages.bookModal.add.title') | translate}}
        </ion-title>
        <ion-buttons slot="end">
          <ion-button color="primary" (click)="dismiss()">
            <ion-icon slot="icon-only" name="close-circle"></ion-icon>
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content>
      <form [formGroup]="form" (submit)="submit()" *ngIf="form">
        <ion-card>
          <img [src]="book.thumb" alt="book-thumb" *ngIf="book">
          <ion-fab vertical="top" horizontal="end">
            <ion-fab-button (click)="takePicture()" class="ion-margin-bottom">
              <ion-icon name="camera"></ion-icon>
            </ion-fab-button>
            <ion-fab-button (click)="selectPicture()">
              <ion-icon name="image"></ion-icon>
            </ion-fab-button>
          </ion-fab>
          <ion-card-content>
            <ion-list>
              <ion-item>
                <ion-label position="floating">
                  {{'pages.bookModal.bookTitle' | translate}}
                </ion-label>
                <ion-input type="text" formControlName="title"></ion-input>
              </ion-item>
              <ion-item>
                <ion-label position="floating">
                  {{'pages.bookModal.bookDescription' | translate}}
                </ion-label>
                <ion-input type="text" formControlName="description"></ion-input>
              </ion-item>
              <ion-item>
                <ion-label position="floating">
                  {{'pages.bookModal.collection' | translate}}
                </ion-label>
                <ion-select formControlName="label">
                  <ion-select-option *ngFor="let label of labels">{{label}}</ion-select-option>
                </ion-select>
              </ion-item>
            </ion-list>
            <ion-button expand="block" color="primary" type="submit" [disabled]="!form.valid">
              {{(editMode ? 'pages.bookModal.edit.submit' : 'pages.bookModal.add.submit') | translate}}
            </ion-button>
          </ion-card-content>
        </ion-card>
      </form>
    </ion-content>
  `
})
export class BookModalPageComponent implements OnInit {

  form: UntypedFormGroup | undefined;
  book: Book | undefined;
  collection: BookCollection | undefined;
  collections: BookCollection[] | undefined;
  editMode = false;

  constructor(private songBookService: SongBooksService,
              private modalController: ModalController,
              private cameraService: CameraService) {
  }

  async submit() {
    await this.modalController.dismiss(Object.assign(this.book || {}, this.form?.value));
  }

  async dismiss() {
    await this.modalController.dismiss();
  }

  takePicture() {
    this.cameraService.getPicture$(CameraSource.Camera).subscribe(image => {
      if (this.book) {
        this.book.thumb = image;
      }
    });
  }

  selectPicture() {
    this.cameraService.getPicture$(CameraSource.Photos).subscribe(image => {
      if (this.book) {
        this.book.thumb = image;
      }
    });
  }

  get labels() {
    return this.collections ? this.collections.map(v => v.name).sort() : [];
  }

  ngOnInit() {
    this.book = this.book || {};
    this.editMode = !!this.book.title;
    this.form = new UntypedFormGroup({
      title: new UntypedFormControl(this.book.title, [Validators.required, Validators.minLength(5)]),
      description: new UntypedFormControl(this.book.description),
      label: new UntypedFormControl(this.collection?.name, [Validators.required])
    });
    if (!this.book.thumb) {
      this.songBookService.defaultCover$.subscribe(book => {
        if (this.book) {
          this.book.thumb = book.thumb;
        }
      });
    }
  }
}
