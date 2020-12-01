import {Injectable} from '@angular/core';
import {LoggerService} from './logger.service';
import {from, Observable} from 'rxjs';
import {CameraOptions, CameraResultType, CameraSource, Plugins} from '@capacitor/core';
import {map} from 'rxjs/operators';

const {Camera} = Plugins;
const width = 600;
const height = 600;

const cameraOptions = (source: CameraSource): CameraOptions => {
  return {
    quality: 50,
    allowEditing: true,
    source,
    resultType: CameraResultType.Base64,
    correctOrientation: true,
    width,
    height
  };
};

@Injectable({
  providedIn: 'root'
})
export class CameraService {

  constructor(private log: LoggerService) {
  }

  getPicture(source: CameraSource): Observable<string> {
    return from(Camera.getPhoto(cameraOptions(source))).pipe(
      map(img => `data:image/jpeg;base64,${img.base64String}`)
    );
  }
}
