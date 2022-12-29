import {Preferences} from '@capacitor/preferences';

const get = async (key: string) => {
  const {value} = await Preferences.get({key});
  return value && JSON.parse(value) || undefined;
}

const set = (key: string, value: any) => {
  return Preferences.set({key, value: JSON.stringify(value)});
}

export const proxify = (value: any, callback?: (object: any) => any) => {
  if (typeof value === 'object') {
    for (const key of Object.keys(value)) {
      if (value[key] != null) {
        value[key] = proxify(value[key], callback);
      }
    }
    return new Proxy(value, {
      get: (target, property) => {
        if (property === 'length') {
          return value.length;
        }
        return target[property];
      },
      set: (target, property, val) => {
        target[property] = val;
        if (callback) {
          callback(target);
        }
        return true;
      }
    });
  } else {
    return value;
  }
};

export const unproxify = (value: any) => {
  if (typeof value === 'object') {
    if (value == null) {
      return null;
    }
    const obj = value.length > -1 ? [] : {} as any;
    for (const key of Object.keys(value)) {
      obj[key] = unproxify(value[key]);
    }
    return obj;
  } else {
    return value;
  }
};

export class StorageModel<T> {

  #model: T | undefined

  constructor(private storageKey: string,
              initial?: T,
              map?: (v: any) => T) {
    get(this.storageKey).then(model => this.#model = map && map(model || initial) || model || initial)
  }

  get model() {
    return this.#model as T
  }

  set model(model) {
    this.#model = model
    set(this.storageKey, model)
  }
}

export class ProxyStorageModel<T> {

  #model: T | undefined

  constructor(private storageKey: string,
              initial?: T) {
    get(this.storageKey).then(model => this.#model = proxify(model || initial, () => set(this.storageKey, unproxify(this.#model))))
  }

  get model() {
    return this.#model as T
  }

  set model(model) {
    const sanitized = unproxify(model)
    this.#model = proxify(sanitized, () => set(this.storageKey, unproxify(this.#model)))
    set(this.storageKey, sanitized)
  }
}
