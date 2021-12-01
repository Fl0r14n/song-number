import {Injectable} from '@angular/core';
import {Storage} from '@capacitor/storage';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  async get(key: string) {
    const {value} = await Storage.get({key});
    return value && JSON.parse(value);
  }

  async set(key: string, value: any) {
    return Storage.set({key, value: JSON.stringify(value)});
  }
}
