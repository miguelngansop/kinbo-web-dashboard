import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {API} from '../helpers/global-constants';
import {concatMap} from 'rxjs/operators';
import {ManageFileService} from './manage-file.service';
import {Music} from '../models/music';
import {forkJoin, merge} from 'rxjs';
import {WowzaService} from './wowza.service';
import {of} from 'rxjs/internal/observable/of';

@Injectable({
  providedIn: 'root'
})
export class MusicService {

  constructor(private http: HttpClient, private uploadService: ManageFileService, private wowzaService: WowzaService) {
  }

  get(id: string) {
    return this.http.get(`${API}/musiques/${id}`);
  }

  getMusicsOfAlbum(id: string) {
    return this.http.get(`${API}/musiques/album/${id}`);
  }

  count() {
    return this.http.get(`${API}/musiques/count`);
  }

  saveMusicsInAlbum(idAlbum: string, musics: Music[]) {
    return this.http.put(API + '/musiques/album/' + idAlbum, musics);
  }

  getAll() {
    return this.http.get(API + '/musiques/all');
  }

  addWithDetails(music: Music, image: File, imageHashCode: string, audio: File, audioHashCode: string, video: File, videoHashCode: string) {
    let sources = [];
    let files = [];
    if (image) {
      sources.push(this.uploadService.saveFile(image, imageHashCode));
      files.push('i');
    }

    if (audio) {
      sources.push(this.uploadService.saveFile(audio, audioHashCode));
      files.push('a');
    }

    if (video) {
      sources.push(this.uploadService.saveFile(video, videoHashCode));
      files.push('v');
    }

    return ((sources.length == 0) ? of([]) : forkJoin(sources)).pipe(
      concatMap((resp) => {
          if (image) {
            let index = files.indexOf('i');
            music.image = (<string>resp[index]).replace(/"/g, '');
          }
          if (audio) {
            let index = files.indexOf('a');
            music.audioURL = (<string>resp[index]).replace(/"/g, '');
          }
          if (video) {
            let index = files.indexOf('v');
            music.videoURL = (<string>resp[index]).replace(/"/g, '');
          }
          return this.http.post(API + '/musiques', music);
        }
      ));
  }

  add(music: Music) {
    return this.http.post(API + '/musiques', music);
  }

  createLive(music: Music) {
    let sources = [];
    let idSources = [];
    if (music.audioURL) {
      let src = music.audioURL;
      if (src) {
        let ext = src.substr(src.lastIndexOf('.') + 1);
        // Live stream uniquement pour mp3 , mp4 et flv
        if (['mp3', 'mp4', 'flv'].includes(ext.toLowerCase())) {
          sources.push(this.wowzaService.createLiveStream(music.nom, src));
        }
      }
    }

    if (sources.length == 0) {
      return of({});
    } else {
      return forkJoin(sources).pipe(
        concatMap((resp: any) => {
            music.streamURL = resp[0].live_stream.player_hls_playback_url;
            music.streamID = resp[0].live_stream.id;
            return this.update(music);
          }
        ));
    }

  }

  update(music: Music) {
    return merge(this.wowzaService.startStream(music.streamID), this.http.put(`${API}/musiques/${music.id}`, music, {responseType: 'text'}));
  }

  updateWithDetails(music: Music, image: File, imageHashCode: string, audio: File, audioHashCode: string, video: File, videoHashCode: string) {
    let sources = [];
    let files = [];
    if (image) {
      sources.push(this.uploadService.saveFile(image, imageHashCode));
      files.push('i');
    }

    if (audio) {
      sources.push(this.uploadService.saveFile(audio, audioHashCode));
      files.push('a');
    }

    if (video) {
      sources.push(this.uploadService.saveFile(video, videoHashCode));
      files.push('v');
    }

    return ((sources.length == 0) ? of([]) : forkJoin(sources)).pipe(
      concatMap((resp) => {
          if (image) {
            let index = files.indexOf('i');
            music.image = (<string>resp[index]).replace(/"/g, '');
          }
          if (audio) {
            let index = files.indexOf('a');
            music.audioURL = (<string>resp[index]).replace(/"/g, '');
          }
          if (video) {
            let index = files.indexOf('v');
            music.videoURL = (<string>resp[index]).replace(/"/g, '');
          }
          return this.http.put(`${API}/musiques/${music.id}`, music);
        }
      ));
  }

  updateWithImage(music: Music, audio: File, audioHashCode: string, video: File, videoHashCode: string) {
    music.audioURL = audioHashCode + '.' + audio.type.substr(6);
    music.videoURL = videoHashCode + '.' + video.type.substr(6);
    return merge(this.uploadService.saveFile(audio, audioHashCode), this.uploadService.saveFile(video, videoHashCode)).pipe(
      concatMap(() => this.http.put(API + '/musiques', music)
      ));
  }

}
