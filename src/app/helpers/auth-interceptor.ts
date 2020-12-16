import {HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {OAuthService} from 'angular-oauth2-oidc';
import {catchError, retry} from 'rxjs/operators';
import {AuthService} from '../services/auth.service';


export class AuthInterceptor implements HttpInterceptor{
  constructor(private oauthService : OAuthService ,private authService : AuthService ){

  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // add authorization header with auth credentials if available
    //const currentUser = this.authenticationService.currentUserValue;
    if (this.oauthService.hasValidAccessToken()) {
      req = req.clone({
        setHeaders: {
          Authorization: this.oauthService.authorizationHeader()
        }
      });
    }
    // this.oauthService.h

    return next.handle(req).pipe(
      retry(2),
      catchError((error:HttpErrorResponse) => {
        if (error.status === 401 || error.status === 403) {
          // 401 handled in auth.interceptor
          this.authService.deleteToken();
        }
        return throwError(error);
      })
    );
  }
}
