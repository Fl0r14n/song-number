import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {Book} from '../../services/types/api';
import {SongBooksService} from '../../services/song-books.service';
import {CameraService, SourceType} from '../../services/camera.service';
import {ModalController} from '@ionic/angular';

@Component({
  selector: 'add-book-modal-page',
  templateUrl: 'add-book-modal.page.html',
  styleUrls: ['add-book-modal.page.scss']
})
export class AddBookModalPageComponent implements OnInit {

  form: FormGroup;
  book: Book;

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
