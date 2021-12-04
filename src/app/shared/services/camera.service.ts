import {Injectable} from '@angular/core';
import {catchError, EMPTY, from, Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {Camera, CameraResultType, CameraSource, ImageOptions} from '@capacitor/camera';
import {LoggerService} from './logger.service';

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

  constructor(private log: LoggerService) {
  }

  /**
   * Get picture
   * @param source camera source
   */
  getPicture$(source: CameraSource): Observable<string> {
    return from(Camera.getPhoto(cameraOptions(source))).pipe(
      catchError(err => {
        this.log.error(err.message);
        return EMPTY;
      }),
      map(img => `data:image/jpeg;base64,${img.base64String}`),
    );
  }
}
