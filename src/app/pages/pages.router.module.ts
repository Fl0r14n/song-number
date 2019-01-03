import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {TabsPageComponent} from './tabs/tabs.page';
import {MainPageComponent} from './main/main.page';
import {InfoPageComponent} from './info/info.page';
import {ConfigPageComponent} from './config/config.page';

const routes: Routes = [
  {
    path: 'tabs',
    component: TabsPageComponent,
    children: [
      {
        path: 'main',
        component: MainPageComponent
      },
      {
        path: 'info',
        component: InfoPageComponent
      },
      {
        path: 'config',
        component: ConfigPageComponent
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
    RouterModule.forChild(routes)
  ],
  exports: [
    RouterModule
  ]
})
export class PagesRouterModule {
}
