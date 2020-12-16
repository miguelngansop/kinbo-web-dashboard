import {Routes} from '@angular/router';

import {ErrorComponent} from './error/error.component';
import {ForgotComponent} from './forgot/forgot.component';
import {LockscreenComponent} from './lockscreen/lockscreen.component';
import {LoginComponent} from './login/login.component';
import {AuthGuard} from '../guards/auth.guard';
import {LockScreenGuard} from '../guards/lock-screen.guard';

export const AuthenticationRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: '404',
        component: ErrorComponent
      },
      {
        path: 'forgot',
        component: ForgotComponent
      },
      {
        path: 'lockscreen',
        component: LockscreenComponent,
        canActivate: [LockScreenGuard]
      },
      {
        path: 'login',
        canActivate:[AuthGuard],
        component: LoginComponent
      },
      // {
      //   path: 'register',
      //   component: RegisterComponent
      // }
    ]
  }
];
