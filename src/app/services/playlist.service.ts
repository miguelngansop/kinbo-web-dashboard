import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {API} from '../helpers/global-constants';
import {Playlist} from '../models/playlist';

@Injectable({
  providedIn: 'root'
})
export class PlaylistService {

  constructor(private http: HttpClient) {
  }

  get(id: string) {
    return this.http.get(`${API}/playlists/${id}`);
  }


  getAll() {
    return this.http.get(API + '/playlists/all');
  }

  add(playlist: Playlist) {
    return this.http.post(API + '/playlists', playlist);
  }
}
