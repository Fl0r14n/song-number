import {Component, QueryList, ViewChildren} from '@angular/core';
import {AlertController, IonItemSliding, ItemReorderEventDetail, ModalController} from '@ionic/angular';
import {TranslateService} from '@ngx-translate/core';
import {BookCollection} from '../../shared/models';
import {SongBooksService} from '../../shared/services';

@Component({
  selector: 'collection-modal',
  template: `
    <ion-header>
      <ion-toolbar>
        <ion-title class="ion-text-center">
          {{'pages.collectionModal.title' | translate}}
        </ion-title>
        <ion-buttons slot="end">
          <ion-button color="primary" (click)="dismiss()">
            <ion-icon slot="icon-only" name="close-circle"></ion-icon>
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">
      <ion-reorder-group [disabled]="false" (ionItemReorder)="reorderCollection($any($event))">
        <ion-item-sliding *ngFor="let collection of collections" #slidersRef>
          <ion-item>
            <ion-label>{{collection.name}}</ion-label>
            <ion-reorder slot="end"></ion-reorder>
          </ion-item>
          <ion-item-options side="start">
            <ion-item-option color="secondary" (click)="editCollection(collection)">
              <ion-icon name="create"></ion-icon>
              {{ 'pages.books.edit' | translate}}
            </ion-item-option>
          </ion-item-options>
          <ion-item-options side="end">
            <ion-item-option color="danger" (click)="removeCollection(collection)">
              <ion-icon name="trash"></ion-icon>
              {{ 'pages.books.delete' | translate}}
            </ion-item-option>
          </ion-item-options>
        </ion-item-sliding>
      </ion-reorder-group>

      <ion-fab vertical="bottom" horizontal="end" slot="fixed">
        <ion-fab-button (click)="addCollection()">
          <ion-icon name="add"></ion-icon>
        </ion-fab-button>
      </ion-fab>
    </ion-content>
  `
})
export class CollectionModalComponent {

  i18n: Record<string, any> = this.i18nService.instant([
    'pages.collectionModal.addDialog',
    'pages.collectionModal.add',
    'pages.collectionModal.edit',
    'pages.collectionModal.cancel',
    'pages.collectionModal.remove',
    'pages.collectionModal.permanentRemoval',
    'pages.collectionModal.collection'
  ]);
  @ViewChildren('slidersRef')
  slidersRef: QueryList<IonItemSliding> | undefined;

  constructor(private modalController: ModalController,
              private i18nService: TranslateService,
              private alertCtrl: AlertController,
              private songBookService: SongBooksService) {
  }

  get collections() {
    return this.songBookService.collections.model;
  }

  dismiss() {
    return this.modalController.dismiss();
  }

  async addCollection() {
    const confirm = await this.alertCtrl.create({
      header: this.i18n['pages.collectionModal.addDialog'],
      inputs: [
        {
          name: 'label',
          placeholder: this.i18n['pages.collectionModal.collection'],
          type: 'text',
          attributes: {
            minlength: 1,
          }
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
            if (data.label.length) {
              this.songBookService.addCollection({name: data.label})
              return true
            }
            return false
          }
        }
      ]
    });
    await confirm.present();
  }

  async removeCollection(collection: BookCollection) {
    const confirm = await this.alertCtrl.create({
      header: this.i18nService.instant('pages.collectionModal.removeDialog', {value: collection.name}),
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
  }

  async editCollection(collection: BookCollection) {
    const confirm = await this.alertCtrl.create({
      header: this.i18nService.instant('pages.collectionModal.editDialog', {value: collection.name}),
      inputs: [
        {
          name: 'label',
          placeholder: this.i18n['pages.collectionModal.collection'],
          type: 'text',
          value: collection.name,
          attributes: {
            minlength: 1,
          }
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
            if (data.label.length) {
              this.closeItemSliders();
              collection.name = data.label;
              return true
            }
            return false
          }
        }
      ]
    });
    await confirm.present();
  }

  async reorderCollection({detail}: CustomEvent<ItemReorderEventDetail>) {
    this.collections.splice(detail.to, 0, this.collections.splice(detail.from, 1)[0]);
    await detail.complete(true);
  }

  private closeItemSliders() {
    // workaround for item-slider
    this.slidersRef?.forEach(v => v.close());
  }
}
