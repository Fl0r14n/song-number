import {Component, OnInit} from '@angular/core';
import {NavParams, ViewController} from 'ionic-angular';

@Component({
  selector: 'page-select-book-modal',
  templateUrl: 'select-book-modal.page.html'
})
export class SelectBookModalPage implements OnInit {

  books: any[];
  book: any;

  constructor(private viewCtrl: ViewController,
              private params: NavParams) {
  }

  selectBook(item) {
    this.viewCtrl.dismiss(item);
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

  ngOnInit(): void {
    this.books = this.params.get('books');
    this.book = this.params.get('book');
  }
}
