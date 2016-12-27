import { Component } from '@angular/core';
import { ViewController, NavParams } from 'ionic-angular';

@Component({
  selector: 'page-select-book-modal',
  templateUrl: 'select-book-modal.html'
})
export class SelectBookModalPage {

  books: any[];
  book: any;

  constructor(public viewCtrl: ViewController, public params: NavParams) {
    this.books = this.params.get('books');
    this.book = this.params.get('book');
  }

  selectBook(item) {
    this.viewCtrl.dismiss(item);
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }
}
