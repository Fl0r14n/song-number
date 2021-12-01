import {Injectable} from '@angular/core';
import {from, Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {Camera, CameraResultType, CameraSource, ImageOptions} from '@capacitor/camera';

const width = 600;
const height = 600;

const cameraOptions = (source: CameraSource): ImageOptions => {
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

  getPicture$(source: CameraSource): Observable<string> {
    return from(Camera.getPhoto(cameraOptions(source))).pipe(
      map(img => `data:image/jpeg;base64,${img.base64String}`)
    );
  }
}
