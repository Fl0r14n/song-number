import {Component} from '@angular/core';
import {Validators, FormBuilder, FormGroup} from '@angular/forms';
import {ViewController} from 'ionic-angular';
import {Camera} from 'ionic-native';

@Component({
  selector: 'page-add-book-modal',
  templateUrl: 'add-book-modal.html'
})
export class AddBookModalPage {

  bookForm: FormGroup;
  book: any;

  constructor(public formBuilder: FormBuilder, public viewCtrl: ViewController) {
    this.bookForm = this.formBuilder.group({
      title: ['', Validators.compose([Validators.required, Validators.minLength(5)])],
      description: ['']
    });
    this.book = {
      thumb: ['assets/thumb/vrednic_este_mielul_1.jpg'],
      img: ['assets/thumb/vrednic_este_mielul_1.jpg'],
    }
  }

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

  addBook() {
    this.viewCtrl.dismiss(Object.assign(this.book, this.bookForm.value));
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
    },);
  }
}
