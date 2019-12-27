import {NgModule} from '@angular/core';
import {LayoutPageComponent} from './pages/layout.page';
import {RouterModule, Routes} from '@angular/router';
import {IonicModule} from '@ionic/angular';

const declarations = [
  LayoutPageComponent
];

const routes: Routes = [
  {
    path: 'tabs',
    component: LayoutPageComponent,
    children: [
      {
        path: 'main',
        children: [
          {
            path: '',
            loadChildren: () =>
              import('../main/main.module').then(m => m.MainModule)
          }
        ]
      },
      {
        path: 'info',
        children: [
          {
            path: '',
            loadChildren: () =>
              import('../info/info.module').then(m => m.InfoModule)
          }
        ]
      },
      {
        path: 'config',
        children: [
          {
            path: '',
            loadChildren: () =>
              import('../config/config.module').then(m => m.ConfigModule)
          }
        ]
      },
      {
        path: '',
        redirectTo: '/tabs/main',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '',
    redirectTo: '/tabs/main',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
    IonicModule
  ],
  declarations,
  exports: [
    RouterModule
  ]
})
export class LayoutModule {
}
