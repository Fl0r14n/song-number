import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {ModalController} from '@ionic/angular';
import {Book, BookCollection} from '../../../shared/models/api';
import {SongBooksService} from '../../../shared/services/song-books.service';
import {CameraService} from '../../../shared/services/camera.service';
import {CameraSource} from '@capacitor/core';


@Component({
  selector: 'book-modal',
  templateUrl: 'book-modal.component.html'
})
export class BookModalPageComponent implements OnInit {

  form: FormGroup;
  book: Book;
  collection: BookCollection;
  collections: BookCollection[];
  editMode;

  constructor(private songBookService: SongBooksService,
              private modalController: ModalController,
              private cameraService: CameraService) {
  }

  async submit() {
    await this.modalController.dismiss(Object.assign(this.book, this.form.value));
  }

  async dismiss() {
    await this.modalController.dismiss();
  }

  takePicture() {
    this.cameraService.getPicture(CameraSource.Camera).subscribe((image) => {
      this.book.thumb = image;
    });
  }

  selectPicture() {
    this.cameraService.getPicture(CameraSource.Photos).subscribe((image) => {
      this.book.thumb = image;
    });
  }

  get labels() {
    return this.collections ? this.collections.map(v => v.name).sort() : [];
  }

  ngOnInit(): void {
    this.book = this.book || {};
    this.collection = this.collection || {
      name: ''
    };
    this.editMode = !!this.book.title;
    this.form = new FormGroup({
      title: new FormControl(this.book.title, [Validators.required, Validators.minLength(5)]),
      description: new FormControl(this.book.description),
      label: new FormControl(this.collection.name)
    });
    if (!this.book.thumb) {
      this.songBookService.getCover().subscribe(book => {
        this.book.thumb = book.thumb;
      });
    }
  }
}
