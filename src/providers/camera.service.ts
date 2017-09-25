import {Injectable} from '@angular/core';
import {Camera, PictureSourceType} from '@ionic-native/camera';
import {LoggerService} from './logger.service';
import {Observable} from 'rxjs/Observable';

export enum SourceType {
  CAMERA,
  GALLERY
}

@Injectable()
export class CameraService {

  public static get INFO(): number {
    return 0;
  }

  constructor(protected camera: Camera, protected log: LoggerService) {}

  cameraOptions(type: SourceType): any {
    let srcType = PictureSourceType.CAMERA;
    switch (type) {
      case SourceType.GALLERY: {
        srcType = PictureSourceType.SAVEDPHOTOALBUM;
        break;
      }
      case SourceType.CAMERA: {
        srcType = PictureSourceType.CAMERA;
        break;
      }
    }
    return {
      // Some common settings are 20, 50, and 100
      quality: 50,
      destinationType: this.camera.DestinationType.DATA_URL,
      // In this app, dynamically set the picture source, Camera or photo gallery
      sourceType: srcType,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      allowEdit: true,
      correctOrientation: true  // Corrects Android orientation quirks
    };
  }

  getPicture(type: SourceType): Observable<string> {
    return new Observable(subscriber => {
      let options = this.cameraOptions(type);
      options.targetHeight = 200;
      options.targetWidth = 200;
      this.camera.getPicture(options).then((imageData) => {
        // imageData is either a base64 encoded string or a file URI
        // If it's base64:
        let base64Image = 'data:image/jpeg;base64,' + imageData;
        subscriber.next(base64Image);
        subscriber.complete();
      }, (err) => {
        this.log.error(err);
        subscriber.error(err);
      });
    });
  }
}
