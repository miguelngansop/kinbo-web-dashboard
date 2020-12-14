import { Routes } from '@angular/router';

import { FullComponent } from './layouts/full/full.component';
import {StarterModule} from './starter/starter.module';
import {MaterialComponentsModule} from './material-component/material.module';

export const AppRoutes: Routes = [
  {
    path: '',
    component: FullComponent,
    children: [
      {
        path: '',
        redirectTo: '/starter',
        pathMatch: 'full'
      },
      {
        path: 'material',
        loadChildren: () => MaterialComponentsModule
      },
      {
        path: 'starter',
        loadChildren: () => StarterModule
      }
    ]
  }
];
