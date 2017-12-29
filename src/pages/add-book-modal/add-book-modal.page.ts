import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ViewController} from 'ionic-angular';
import {CameraService, SourceType} from '../../providers/camera.service';
import {SongBooksService} from '../../providers/song-books.service';
import {Book} from '../../providers/types/api';

@Component({
  selector: 'page-add-book-modal',
  templateUrl: 'add-book-modal.page.html'
})
export class AddBookModalPage implements OnInit {

  bookForm: FormGroup;
  book: Book = {
    thumb: ''
  };

  constructor(private formBuilder: FormBuilder,
              private songBookService: SongBooksService,
              private viewCtrl: ViewController,
              private cameraService: CameraService) {
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

  ngOnInit(): void {
    this.bookForm = this.formBuilder.group({
      title: ['', Validators.compose([Validators.required, Validators.minLength(5)])],
      description: ['']
    });
    this.songBookService.getCoverBook().subscribe(book => {
      this.book = book
    });
  }
}
