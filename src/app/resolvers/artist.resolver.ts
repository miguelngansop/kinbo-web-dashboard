import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot} from '@angular/router';
import {Observable} from 'rxjs';
import {catchError} from 'rxjs/operators';
import {of} from 'rxjs/internal/observable/of';
import {ArtistService} from '../services/artist.service';

@Injectable({
  providedIn: 'root'
})
export class ArtistResolver implements Resolve<any> {

  constructor(private artistService : ArtistService, private router: Router) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
    return this.artistService.get(route.paramMap.get('id')).pipe(catchError(() => {
      this.router.navigateByUrl('/404');
      return of(null);
    }));
  }
}
