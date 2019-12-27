import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {ModalController} from '@ionic/angular';
import {Book} from '../../../shared/models/api';
import {SongBooksService} from '../../../shared/services/song-books.service';
import {CameraService, SourceType} from '../../../shared/services/camera.service';

@Component({
  selector: 'book-modal-page',
  templateUrl: 'book-modal.component.html',
  styleUrls: ['book-modal.component.scss']
})
export class BookModalPageComponent implements OnInit {

  form: FormGroup;
  book: Book;
  editMode;

  constructor(private songBookService: SongBooksService,
              private modalController: ModalController,
              private cameraService: CameraService) {
  }

  submit() {
    this.modalController.dismiss(Object.assign(this.book, this.form.value));
  }

  dismiss() {
    this.modalController.dismiss();
  }

  takePicture() {
    this.cameraService.getPicture(SourceType.CAMERA).subscribe((image) => {
      this.book.thumb = image;
    });
  }

  selectPicture() {
    this.cameraService.getPicture(SourceType.GALLERY).subscribe((image) => {
      this.book.thumb = image;
    });
  }

  ngOnInit(): void {
    this.book = this.book || {};
    this.editMode = !!this.book.title;
    this.form = new FormGroup({
      title: new FormControl(this.book.title, [Validators.required, Validators.minLength(5)]),
      description: new FormControl(this.book.description)
    });
    if (!this.book.thumb) {
      this.songBookService.getCoverBook().subscribe(book => {
        this.book.thumb = book.thumb;
      });
    }
  }
}
