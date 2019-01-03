import {Component, OnInit} from '@angular/core';
import {ModalController, NavParams} from '@ionic/angular';

@Component({
  selector: 'select-book-modal-page',
  templateUrl: 'select-book-modal.page.html',
  styleUrls: ['select-book-modal.page.scss']
})
export class SelectBookModalPageComponent implements OnInit {

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
