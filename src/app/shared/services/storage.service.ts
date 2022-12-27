import {Injectable} from '@angular/core';
import {Preferences} from '@capacitor/preferences';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  async get(key: string) {
    const {value} = await Preferences.get({key});
    return value && JSON.parse(value);
  }

  async set(key: string, value: any) {
    return Preferences.set({key, value: JSON.stringify(value)});
  }
}
