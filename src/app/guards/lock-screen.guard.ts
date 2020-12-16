import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree} from '@angular/router';
import {Observable} from 'rxjs';
import {CURRENT_USER} from '../helpers/global-constants';

@Injectable({
  providedIn: 'root'
})
export class LockScreenGuard implements CanActivate {
  constructor(private router: Router) {
  }

  canActivate(
      next: ActivatedRouteSnapshot,
      state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    if (localStorage.getItem(CURRENT_USER)) {
      return true;
    } else {
      this.router.navigateByUrl('/');
      return false;
    }
  }

}
