import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {API} from '../helpers/global-constants';
import {concatMap} from 'rxjs/operators';
import {ManageFileService} from './manage-file.service';
import {forkJoin, merge} from 'rxjs';
import {Album} from '../models/album';
import {Playlist} from '../models/playlist';

@Injectable({
  providedIn: 'root'
})
export class AlbumService {

  constructor(private http: HttpClient, private uploadService: ManageFileService) {
  }

  get(id: string) {
    return this.http.get(`${API}/albums/${id}`);
  }

  count() {
    return this.http.get(`${API}/albums/count`);
  }

  getAll() {
    return this.http.get(API + '/albums/all');
  }

  addWithImage(album: Album, file: File, hashCode: string) {
    return this.uploadService.saveFile(file, hashCode).pipe(
      concatMap((res: string) => {
          album.image = res.replace(/"/g, '');
          return this.http.post(API + '/albums', album);
        }
      ));
  }

  add(album: Album) {
     return this.http.post(API + '/albums', album);
  }


  updateWithImage(album: Album, file: File, hashCode: string) {
    return this.uploadService.saveFile(file, hashCode).pipe(
      concatMap((res: string) => {
          album.image = res.replace(/"/g, '');
          return this.http.put(`${API}/albums/${album.id}`, album);
        }
      ));
  }

  update(id: string, album: Album) {
    return this.http.put(`${API}/albums/${id}`, album, {responseType: 'text'});
  }

  delete(id: string) {
    return this.http.delete(`${API}/albums/${id}`, {responseType: 'text'});
  }

}
