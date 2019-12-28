export interface Digit {
  pos?: number;
  value?: number;
}

export interface Book {
  title?: string;
  description?: string;
  thumb?: string;
}

export interface BookCollection {
  section?: string;
  books?: Book[];
}


