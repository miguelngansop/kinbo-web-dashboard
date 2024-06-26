import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {API} from '../helpers/global-constants';
import {concatMap} from 'rxjs/operators';
import {ManageFileService} from './manage-file.service';
import {Artist} from '../models/artist';

@Injectable({
  providedIn: 'root'
})
export class ArtistService {

  constructor(private http: HttpClient, private uploadService: ManageFileService) {
  }

  get(id: string) {
    return this.http.get(`${API}/artistes/${id}`);
  }

  count() {
    return this.http.get(`${API}/artistes/count`);
  }

  getAll() {
    return this.http.get(API + '/artistes/all');
  }

  searchByName(name: string) {
    return this.http.get(API + `/artistes/recherche/${name}`);
  }

  getAlbums(id: string) {
    return this.http.get(API + `/albums/artiste/${id}`);
  }

  getMusics(id: string) {
    return this.http.get(API + `/musiques/artiste/${id}`);
  }

  getNoAlbumMusics(id: string) {
    return this.http.get(`${API}/musiques/artiste/${id}/no-album`);
  }

  addWithImage(artist: Artist, file: File, hashCode: string) {
    return this.uploadService.saveFile(file, hashCode).pipe(
      concatMap((res: string) => {
          artist.imagePersonne = res.replace(/"/g, '');
          return this.http.post(API + '/artistes', artist);
        }
      ));
  }

  add(artist : Artist){
    return this.http.post(API+'/artistes',artist);
  }

  update(artist: Artist) {
    return this.http.put(API + '/artistes', artist);
  }

  updateWithImage(artist: Artist, file: File, hashCode: string) {
    return this.uploadService.saveFile(file, hashCode).pipe(
      concatMap((res: string) => {
          artist.imagePersonne = res.replace(/"/g, '');
          return this.http.put(API + '/artistes', artist);
        }
      ));
  }

}
