import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {ReactiveFormsModule} from '@angular/forms';
import {RouterModule} from '@angular/router';
import {IonicModule} from '@ionic/angular';
import {TranslateModule} from '@ngx-translate/core';
import {BookModalPageComponent} from './components/book-modal.component';
import {CollectionModalComponent} from './components/collection-modal.component';
import {BooksPageComponent} from './pages/books.page';

@NgModule({
  imports: [
    RouterModule.forChild([{
      path: '',
      component: BooksPageComponent
    }]),
    IonicModule,
    TranslateModule,
    CommonModule,
    ReactiveFormsModule
  ],
  declarations: [
    BookModalPageComponent,
    CollectionModalComponent,
    BooksPageComponent
  ]
})
export class BooksModule {
}
