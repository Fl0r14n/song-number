import {Injectable} from '@angular/core';
import {LoggerService} from './logger.service';
import {noop, Observable} from 'rxjs';
import {PictureSourceType, Camera} from '@ionic-native/camera/ngx';

export enum SourceType {
  CAMERA,
  GALLERY
}

const width = 600;
const height = 600;

@Injectable({
  providedIn: 'root'
})
export class CameraService {

  constructor(private camera: Camera,
              private log: LoggerService) {
  }

  getPicture(type: SourceType): Observable<string> {
    return new Observable(subscriber => {
      const options = this.cameraOptions(type);
      options.targetHeight = height;
      options.targetWidth = width;
      this.camera.getPicture(options).then((imageData) => {
        subscriber.next(`data:image/jpeg;base64,${imageData}`);
        subscriber.complete();
      }, (err) => {
        this.log.error(err).then(noop, noop);
        subscriber.error(err);
      });
    });
  }

  private cameraOptions(type: SourceType): any {
    return {
      // Some common settings are 20, 50, and 100
      quality: 50,
      destinationType: this.camera.DestinationType.DATA_URL,
      // In this app, dynamically set the picture source, Camera or photo gallery
      sourceType: SourceType.GALLERY ? PictureSourceType.SAVEDPHOTOALBUM : PictureSourceType.CAMERA,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      allowEdit: true,
      correctOrientation: true  // Corrects Android orientation quirks
    };
  }
}
