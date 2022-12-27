import {NgModule} from '@angular/core';
import {BooksPageComponent} from './pages/books.page';
import {RouterModule, Routes} from '@angular/router';
import {IonicModule} from '@ionic/angular';
import {TranslateModule} from '@ngx-translate/core';
import {CommonModule} from '@angular/common';
import {BookModalPageComponent} from './components/book-modal.component';
import {ReactiveFormsModule} from '@angular/forms';
import {CollectionModalComponent} from './components/collection-modal.component';

const entryComponents = [
  BookModalPageComponent,
  CollectionModalComponent
];

const declarations = [
  ...entryComponents,
  BooksPageComponent
];

const routes: Routes = [
  {
    path: '',
    component: BooksPageComponent
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
    IonicModule,
    TranslateModule,
    CommonModule,
    ReactiveFormsModule
  ],
  entryComponents,
  declarations
})
export class BooksModule {
}
