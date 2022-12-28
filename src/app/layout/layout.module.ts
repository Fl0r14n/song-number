import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {IonicModule} from '@ionic/angular';
import {LayoutPageComponent} from './pages/layout.page';

@NgModule({
  imports: [
    RouterModule.forChild([{
      path: '',
      component: LayoutPageComponent,
      children: [
        {
          path: 'main',
          loadChildren: () => import('../main/main.module').then(m => m.MainModule)
        },
        {
          path: 'info',
          loadChildren: () => import('../info/info.module').then(m => m.InfoModule)
        },
        {
          path: 'books',
          loadChildren: () => import('../books/books.module').then(m => m.BooksModule)
        },
        {
          path: 'config',
          loadChildren: () => import('../config/config.module').then(m => m.ConfigModule)
        },
        {
          path: '**',
          redirectTo: 'main',
        }
      ]
    }]),
    IonicModule
  ],
  declarations: [
    LayoutPageComponent
  ]
})
export class LayoutModule {
}
