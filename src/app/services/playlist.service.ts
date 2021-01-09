import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {API} from '../helpers/global-constants';
import {Playlist} from '../models/playlist';
import {WowzaService} from './wowza.service';
import {forkJoin} from 'rxjs';
import {concatMap} from 'rxjs/operators';
import {date} from 'ng2-validation/dist/date';

@Injectable({
  providedIn: 'root'
})
export class PlaylistService {

  constructor(private http: HttpClient, private wowzaService: WowzaService) {
  }

  get(id: string) {
    return this.http.get(`${API}/playlists/${id}`);
  }


  getAll() {
    return this.http.get(API + '/playlists/all');
  }

  add(playlist: Playlist) {
    let sources = [];
    let idSources = [];
    playlist.musiques.forEach((value, index) => {
      if (value.audioURL || value.videoURL) {
        let src = value.videoURL || value.audioURL;
        if (src) {
          let ext = src.substr(src.lastIndexOf('.') + 1);
          // Live stream uniquement pour mp3 , mp4 et flv
          if (['mp3', 'mp4', 'flv'].includes(ext.toLowerCase())) {
            sources.push(this.wowzaService.createLiveStream(playlist.nom + value.nom, src));
            idSources.push(index);
          }
        }
      }
    });

    return forkJoin(sources).pipe(
      concatMap((resp: any) => {
          playlist.musiques.map((value, index) => {
            if (idSources.includes(index)) {
              value.streamURL = resp[idSources.indexOf(index)].live_stream.player_hls_playback_url;
            }
            return value;
          });
          return this.http.post(API + '/playlists', playlist);
        }
      ));

  }
}
