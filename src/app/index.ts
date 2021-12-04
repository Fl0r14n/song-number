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


