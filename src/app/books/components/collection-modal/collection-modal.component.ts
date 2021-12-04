import {Component, OnInit, QueryList, ViewChildren} from '@angular/core';
import {AlertController, IonItemSliding, ModalController} from '@ionic/angular';
import {TranslateService} from '@ngx-translate/core';
import {BookCollection} from '../../../index';
import {SongBooksService} from '../../../shared/services/song-books.service';

@Component({
  selector: 'collection-modal',
  templateUrl: 'collection-modal.component.html'
})
export class CollectionModalComponent implements OnInit {

  i18n: Record<string, any> = {};
  @ViewChildren('slidersRef')
  slidersRef: QueryList<IonItemSliding> | undefined;

  constructor(private modalController: ModalController,
              private i18nService: TranslateService,
              private alertCtrl: AlertController,
              private songBookService: SongBooksService) {
  }

  get collections() {
    return this.songBookService.collections;
  }

  async dismiss() {
    await this.modalController.dismiss();
  }

  async addCollection() {
    const confirm = await this.alertCtrl.create({
      header: this.i18n['pages.collectionModal.addDialog'],
      inputs: [
        {
          name: 'label',
          placeholder: this.i18n['pages.collectionModal.collection'],
          type: 'text',
        }
      ],
      buttons: [
        {
          text: this.i18n['pages.collectionModal.cancel'],
          handler: () => {
            this.closeItemSliders();
          }
        },
        {
          text: this.i18n['pages.collectionModal.add'],
          handler: (data) => {
            this.closeItemSliders();
            this.songBookService.addCollection({name: data.label});
          }
        }
      ]
    });
    await confirm.present();
  }

  removeCollection(collection: BookCollection) {
    this.i18nService.get('pages.collectionModal.removeDialog', {
      value: collection.name
    }).subscribe(async (value) => {
      const confirm = await this.alertCtrl.create({
        header: value,
        message: this.i18n['pages.collectionModal.permanentRemoval'],
        buttons: [
          {
            text: this.i18n['pages.collectionModal.cancel'],
            handler: () => {
              this.closeItemSliders();
            }
          },
          {
            text: this.i18n['pages.collectionModal.remove'],
            handler: () => {
              this.closeItemSliders();
              const idx = this.collections.indexOf(collection);
              this.collections.splice(idx, 1);
            }
          }
        ]
      });
      await confirm.present();
    });
  }

  editCollection(collection: BookCollection) {
    this.i18nService.get('pages.collectionModal.editDialog', {
      value: collection.name
    }).subscribe(async (value) => {
      const confirm = await this.alertCtrl.create({
        header: value,
        inputs: [
          {
            name: 'label',
            placeholder: this.i18n['pages.collectionModal.collection'],
            type: 'text',
            value: collection.name
          }
        ],
        buttons: [
          {
            text: this.i18n['pages.collectionModal.cancel'],
            handler: () => {
              this.closeItemSliders();
            }
          },
          {
            text: this.i18n['pages.collectionModal.edit'],
            handler: (data) => {
              this.closeItemSliders();
              collection.name = data.label;
            }
          }
        ]
      });
      await confirm.present();
    });
  }

  async reorderCollection({detail}: CustomEvent) {
    this.collections.splice(detail.to, 0, this.collections.splice(detail.from, 1)[0]);
    await detail.complete(true);
  }

  private closeItemSliders() {
    // workaround for item-slider
    this.slidersRef?.forEach(v => v.close());
  }

  ngOnInit(): void {
    this.i18nService.get([
      'pages.collectionModal.addDialog',
      'pages.collectionModal.add',
      'pages.collectionModal.edit',
      'pages.collectionModal.cancel',
      'pages.collectionModal.remove',
      'pages.collectionModal.permanentRemoval',
      'pages.collectionModal.collection',
    ]).subscribe((value) => {
      this.i18n = value;
    });
  }
}
