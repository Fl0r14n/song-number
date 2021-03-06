import {Component, OnInit, QueryList, ViewChildren} from '@angular/core';
import {AlertController, IonItemSliding, ModalController} from '@ionic/angular';
import {TranslateService} from '@ngx-translate/core';
import {SongNumberService} from '../../../shared/services/song-number.service';

@Component({
  selector: 'collection-modal',
  templateUrl: 'collection-modal.component.html'
})
export class CollectionModalComponent implements OnInit {

  i18n: any[];
  @ViewChildren('slidersRef')
  slidersRef: QueryList<IonItemSliding>;

  constructor(private modalController: ModalController,
              private i18nService: TranslateService,
              private alertCtrl: AlertController,
              private songNumberService: SongNumberService) {
  }

  get collections() {
    return this.songNumberService.collections;
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
            this.songNumberService.addCollection(data.label);
          }
        }
      ]
    });
    await confirm.present();
  }

  removeCollection(collection) {
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

  editCollection(collection) {
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

  async reorderCollection({detail}) {
    this.collections.splice(detail.to, 0, this.collections.splice(detail.from, 1)[0]);
    await detail.complete(true);
  }

  private closeItemSliders() {
    // workaround for item-slider
    this.slidersRef.forEach(v => v.close());
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
