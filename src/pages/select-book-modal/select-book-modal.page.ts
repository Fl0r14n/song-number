import {Component} from '@angular/core';
import {ViewController, NavParams} from 'ionic-angular';

@Component({
  selector: 'page-select-book-modal',
  templateUrl: 'select-book-modal.page.html'
})
export class SelectBookModalPage {

  books: any[];
  book: any;

  constructor(protected viewCtrl: ViewController,
              params: NavParams) {
    this.books = params.get('books');
    this.book = params.get('book');
  }

  selectBook(item) {
    this.viewCtrl.dismiss(item);
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }
}
