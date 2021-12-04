# song-number

SongNumber is a small mobile app that will allow user to set a song number from a list of song books and cast it

## How to submit a book collection

### Preparation

* fork the project

### Do the work

* have a look at the `downloads` folder structure
* if your target language is not specified, add it to `languages.json`. The structure is `Language[]` where:

```typescript
export interface Language {
  code: string; // language code like en, de, fr
  name: string; // language name
}
```

* add your collection json in the assets for specified language. Your file must respect `BookCollection[]` where:

```typescript
export interface BookCollection {
  name: string; // the name of your collection like My collection
  books: Book[]; // the books in the collection
}

export interface Book {
  title: string; // the book title
  description?: string; // some optional description for the book
  thumb?: string; // optional data:image/jpeg;base64 string with the cover of the book
}
```

* In order to generate a picture make sure your image is around 600x600px and the file does not exceed ~100kB.
* Use a online tool to convert a image to base64. Copy the generated base64 string and add it to the `thumb` property.

* Last step is to index your file in the `index/:language/collections.json`. The `collections.json`
  respects `BookResourceCollection[]` where:

```typescript
export interface BookResourceCollection {
  name: string; // some name for your collection. Can be the same name as in the assets file. This name is visible when the user uses the import option
  description?: string; // some optional description
  thumb?: string; // some optional thumb. Can be a representative image for your collection
  paths: string[]; // the path to your asset file. Multiple asset paths can be defined from other existing assets  
}
```

### How to edit a book collection

1) Just edit the corresponding asset file
2) Compile a collection using multiple paths in `collections.json`

### Submit your work

* create a pull request back to this repository
