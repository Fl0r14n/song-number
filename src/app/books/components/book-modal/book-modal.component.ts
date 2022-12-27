import {Component, OnInit} from '@angular/core';
import {UntypedFormControl, UntypedFormGroup, Validators} from '@angular/forms';
import {ModalController} from '@ionic/angular';
import {SongBooksService} from '../../../shared/services/song-books.service';
import {CameraService} from '../../../shared/services/camera.service';
import {CameraSource} from '@capacitor/camera';
import {Book, BookCollection} from '../../../index';


@Component({
  selector: 'book-modal',
  templateUrl: 'book-modal.component.html'
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
    await this.modalController.dismiss(Object.assign(this.book, this.form?.value));
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

  ngOnInit(): void {
    this.book = this.book || {};
    this.editMode = !!this.book.title;
    this.form = new UntypedFormGroup({
      title: new UntypedFormControl(this.book.title, [Validators.required, Validators.minLength(5)]),
      description: new UntypedFormControl(this.book.description),
      label: new UntypedFormControl(this.collection?.name, [Validators.required])
    });
    if (!this.book.thumb) {
      this.songBookService.getDefaultCover$().subscribe(book => {
        if (this.book) {
          this.book.thumb = book.thumb;
        }
      });
    }
  }
}
