import { Injectable } from '@angular/core';
import {CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router} from '@angular/router';
import { Observable } from 'rxjs';
import {OAuthService} from 'angular-oauth2-oidc';
import {AuthService} from '../services/auth.service';
import {CURRENT_USER} from '../helpers/global-constants';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private router : Router /*,private oauthService : OAuthService*/){

  }
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    if(next.routeConfig.path === 'login'){
      // if(this.oauthService.hasValidAccessToken()){
      if(localStorage.getItem(CURRENT_USER)){
        this.router.navigateByUrl('/');
        return false;
      }else{
        return true;
      }
    }else{
        // if(this.oauthService.hasValidAccessToken()){
         if(localStorage.getItem(CURRENT_USER)){
          return true;
        }else{
          this.router.navigateByUrl('/login');
          return false;
        }
    }
  }

}
