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

export interface Digit {
  pos?: number;
  value?: number;
}

export interface Book {
  title?: string;
  description?: string;
  thumb?: string;
}

export interface Language {
  code?: string;
  name?: string;
}

export interface BookResourceCollection {
  name?: string;
  description?: string;
  thumb?: string;
  paths: string[];
  selected?: boolean;
}

export interface BookCollection {
  name?: string;
  books?: Book[];
  reorder?: boolean;
}


