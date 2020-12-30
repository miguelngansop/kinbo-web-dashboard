import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot} from '@angular/router';
import {Observable} from 'rxjs';
import {catchError} from 'rxjs/operators';
import {of} from 'rxjs/internal/observable/of';
import {AlbumService} from '../services/album.service';

@Injectable({
  providedIn: 'root'
})
export class AlbumResolver implements Resolve<any> {

  constructor(private albumService: AlbumService, private router: Router) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
    return this.albumService.get(route.paramMap.get('id')).pipe(catchError(() => {
      this.router.navigateByUrl('/404');
      return of(null);
    }));
  }
}
