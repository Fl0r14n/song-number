import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {IonicModule} from '@ionic/angular';
import {LayoutPageComponent} from './pages/layout.page';

const routes: Routes = [
  {
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
  },
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
    IonicModule
  ],
  declarations: [
    LayoutPageComponent
  ],
  exports: [
    RouterModule
  ]
})
export class LayoutModule {
}
