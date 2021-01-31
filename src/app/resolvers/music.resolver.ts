import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot} from '@angular/router';
import {Observable} from 'rxjs';
import {catchError, concatMap} from 'rxjs/operators';
import {of} from 'rxjs/internal/observable/of';
import {MusicService} from '../services/music.service';
import {Music} from '../models/music';

@Injectable({
  providedIn: 'root'
})
export class MusicResolver implements Resolve<any> {

  constructor(private musicService: MusicService, private router: Router) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
    return this.musicService.get(route.paramMap.get('id')).pipe(catchError(() => {
      this.router.navigateByUrl('/404');
      return of(null);
    }));
  }
}
