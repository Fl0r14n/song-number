export interface Digit {
  pos?: number;
  value?: number;
}

export interface Book {
  title?: string;
  description?: string;
  thumb?: string;
}

export interface BookResourceCollection {
  name?: string;
  description?: string;
  thumb?: string;
  paths?: string[];
}

export interface BookCollection {
  name?: string;
  books?: Book[];
  reorder?: boolean;
}


