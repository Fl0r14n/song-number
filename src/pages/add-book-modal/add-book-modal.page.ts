import {Component} from '@angular/core';
import {Validators, FormBuilder, FormGroup} from '@angular/forms';
import {ViewController} from 'ionic-angular';
import {CameraService, SourceType} from '../../providers/camera.service';
import {SongBooksService} from '../../providers/song-books.service';
import {Book} from '../../providers/types/api';

@Component({
  selector: 'page-add-book-modal',
  templateUrl: 'add-book-modal.page.html'
})
export class AddBookModalPage {

  bookForm: FormGroup;
  book: Book = {
    thumb: ''
  };

  constructor(formBuilder: FormBuilder,
              songBookService: SongBooksService,
              protected viewCtrl: ViewController,
              protected cameraService: CameraService) {
    this.bookForm = formBuilder.group({
      title: ['', Validators.compose([Validators.required, Validators.minLength(5)])],
      description: ['']
    });
    songBookService.getCoverBook().subscribe(book => {
      this.book = book
    });
  }

  addBook() {
    this.viewCtrl.dismiss(Object.assign(this.book, this.bookForm.value));
  }

  dismiss() {
    this.viewCtrl.dismiss();
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
}
