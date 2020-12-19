import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {API} from '../helpers/global-constants';
import {concatMap} from 'rxjs/operators';
import {ManageFileService} from './manage-file.service';
import {Genre} from '../models/genre';

@Injectable({
  providedIn: 'root'
})
export class GenreService {

  constructor(private http: HttpClient, private uploadService: ManageFileService) {
  }

  get(id: string) {
    return this.http.get(`${API}/genres/${id}`);
  }

  getAll() {
    return this.http.get(API + '/genres/all');
  }

  addWithImage(genre: Genre, file: File, hashCode: string) {
    return this.uploadService.saveFile(file, hashCode).pipe(
      concatMap((res: string) => {
          genre.image = res.replace(/"/g, '');
          return this.http.post(API + '/genres', genre);
        }
      ));
  }

  add(genre: Genre) {
    return this.http.post(API + '/genres', genre);
  }

  update(genre: Genre) {
    return this.http.put(API + '/genres', genre);
  }

  updateWithImage(genre: Genre, file: File, hashCode: string) {
    return this.uploadService.saveFile(file, hashCode).pipe(
      concatMap((res: string) => {
          genre.image = res.replace(/"/g, '');
          return this.http.put(API + '/genres', genre);
        }
      ));
  }

}
