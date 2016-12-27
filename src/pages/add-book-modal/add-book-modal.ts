import {Component} from '@angular/core';
import {ViewController} from 'ionic-angular';
import {Camera} from 'ionic-native';

@Component({
  selector: 'page-add-book-modal',
  templateUrl: 'add-book-modal.html'
})
export class AddBookModalPage {

  book: any = {
    title: '',
    description: '',
    thumb: 'assets/thumb/vrednic_este_mielul_1.jpg',
    img: 'assets/thumb/vrednic_este_mielul_1.jpg',
  };

  cameraOptions(srcType): any {
    return {
      // Some common settings are 20, 50, and 100
      quality: 50,
      // destinationType: Camera.DestinationType.FILE_URI,
      destinationType: Camera.DestinationType.DATA_URL,
      // In this app, dynamically set the picture source, Camera or photo gallery
      sourceType: srcType,
      encodingType: Camera.EncodingType.JPEG,
      mediaType: Camera.MediaType.PICTURE,
      allowEdit: true,
      correctOrientation: true  //Corrects Android orientation quirks
    };
  }

  constructor(public viewCtrl: ViewController) {
  }

  addBook() {
    this.viewCtrl.dismiss(this.book);
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

  getPicture() {
    let options = this.cameraOptions(Camera.PictureSourceType.CAMERA);
    options.targetHeight = 200;
    options.targetWidth = 200;
    Camera.getPicture(options).then((imageData) => {
      // imageData is either a base64 encoded string or a file URI
      // If it's base64:
      let base64Image = 'data:image/jpeg;base64,' + imageData;
      this.book.thumb = base64Image;
    }, (err) => {
      console.debug("Unable to obtain picture: " + err, "app");
    }, );
  }
}
