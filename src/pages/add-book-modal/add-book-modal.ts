import {Component} from '@angular/core';
import {ViewController} from 'ionic-angular'

@Component({
  selector: 'page-add-book-modal',
  templateUrl: 'add-book-modal.html'
})
export class AddBookModalPage {

  book: any = {
    title: '',
    description: '',
    thumb: '',
    img: '',
  };

  constructor(public viewCtrl: ViewController) {
  }

  addBook() {
    this.viewCtrl.dismiss(this.book);
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }
}
