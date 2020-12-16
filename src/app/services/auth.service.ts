import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {Router} from '@angular/router';
import {OAuthService} from 'angular-oauth2-oidc';
import {API, CURRENT_USER, OAUTH_CONFIG} from '../helpers/global-constants';
import {ToastrService} from 'ngx-toastr';
import {User} from '../models/user';
import {BehaviorSubject} from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  userSubject: BehaviorSubject<User> = new BehaviorSubject<User>(null);

  constructor(private http: HttpClient, private router: Router, private toastr: ToastrService/*, private oauthService: OAuthService*/) {
    // this.oauthService.configure(OAUTH_CONFIG);
    // this.oauthService.setStorage(sessionStorage);
  }

  login(matricule: string, password: string) {
    if(matricule == 'admin' && password == 'admin'){
        if (this.getCurrentUser()) {
          this.setCurrentUser(this.getCurrentUser());
          this.router.navigateByUrl('/');
        }
    }else{
      this.toastr.error('Identifiants incorrects','Authentification echouée');
    }
    // return this.oauthService.fetchTokenUsingPasswordFlowAndLoadUserProfile(matricule, password).then(() => {
    //   if (this.getCurrentUser()) {
    //     this.setCurrentUser(this.getCurrentUser());
    //     this.router.navigateByUrl('/');
    //   }
    // }).catch((reason : HttpErrorResponse) => {
    //     switch (reason.status) {
    //       case 400 :
    //         this.toastr.error('Identifiants incorrects','Authentification echouée');
    //         break;
    //       case 500 :
    //         this.toastr.error('Le serveur ne repond pas','Erreur serveur');
    //         break;
    //       default:
    //         this.toastr.error(reason.error.error_description,reason.error.error);
    //     }
    // });
  }

  logout() {
    // this.userSubject.next(null);
    localStorage.removeItem(CURRENT_USER);
    // this.http.delete(API + '/api/tokens').toPromise().then(() => {
      this.deleteToken();
    // });
  }

  deleteToken() {
    // this.oauthService.logOut();
    if (localStorage.getItem(CURRENT_USER)) {
      this.router.navigateByUrl('/lockscreen');
    } else {
      this.router.navigateByUrl('/login');
    }
  }

  getCurrentUser(): User {
    //this.oauthService.getIdentityClaims() ? <User> this.oauthService.getIdentityClaims() : null;
    return <User> {userLogin : "admin" , userLastname : "Kinbo Admin" }
  }

  setCurrentUser(user: User) {
    localStorage.setItem(CURRENT_USER, JSON.stringify(user));
    this.userSubject.next(user);
  }
}
