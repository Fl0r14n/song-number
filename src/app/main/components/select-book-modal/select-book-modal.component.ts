import {Component, OnInit} from '@angular/core';
import {ModalController, NavParams} from '@ionic/angular';

@Component({
  selector: 'select-book-modal',
  templateUrl: 'select-book-modal.component.html',
})
export class SelectBookModalComponent implements OnInit {

  books: any[];
  book: any;

  constructor(private modalCtrl: ModalController,
              private params: NavParams) {
  }

  async selectBook(item) {
    return await this.modalCtrl.dismiss(item);
  }

  async dismiss() {
    return await this.modalCtrl.dismiss();
  }

  ngOnInit(): void {
    this.books = this.params.get('books');
    this.book = this.params.get('book');
  }
}
