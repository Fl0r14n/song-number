import {Component, OnInit} from '@angular/core';
import {ModalController, NavParams} from '@ionic/angular';
import {Book, BookCollection} from '../../../shared/models/api';

@Component({
  selector: 'select-book-modal',
  templateUrl: 'select-book-modal.component.html',
})
export class SelectBookModalComponent implements OnInit {

  collections: BookCollection[] | undefined;
  book: any;

  constructor(private modalCtrl: ModalController,
              private params: NavParams) {
  }

  async selectBook(item: Book) {
    return await this.modalCtrl.dismiss(item);
  }

  async dismiss() {
    return await this.modalCtrl.dismiss();
  }

  ngOnInit(): void {
    this.collections = this.params.get('collections');
    this.book = this.params.get('book');
  }
}
