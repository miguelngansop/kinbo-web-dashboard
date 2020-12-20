import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {API} from '../helpers/global-constants';
import {concatMap} from 'rxjs/operators';
import {ManageFileService} from './manage-file.service';
import {Music} from '../models/music';
import {forkJoin, merge} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MusicService {

  constructor(private http: HttpClient, private uploadService: ManageFileService) {
  }

  get(id: string) {
    return this.http.get(`${API}/musiques/${id}`);
  }

  getAll() {
    return this.http.get(API + '/musiques/all');
  }

  addWithDetails(music: Music, image: File, imageHashCode: string, audio: File, audioHashCode: string, video: File, videoHashCode: string) {
    let sources = [this.uploadService.saveFile(image, imageHashCode), this.uploadService.saveFile(audio, audioHashCode)];
    if (video) {
      sources.push(this.uploadService.saveFile(video, videoHashCode));
    }

    return forkJoin(sources).pipe(
      concatMap((resp) => {
        music.image = (<string>resp[0]).replace(/"/g, '');
        music.audioURL = (<string>resp[1]).replace(/"/g, '');
          if (video) {
            music.videoURL = (<string>resp[2]).replace(/"/g, '');
          }
          return this.http.post(API + '/musiques', music);
        }
      ));
  }

  add(music: Music) {
    return this.http.post(API + '/musiques', music);
  }

  update(music: Music) {
    return this.http.put(API + '/musiques', music);
  }

  updateWithImage(music: Music, audio: File, audioHashCode: string, video: File, videoHashCode: string) {
    music.audioURL = audioHashCode + '.' + audio.type.substr(6);
    music.videoURL = videoHashCode + '.' + video.type.substr(6);
    return merge(this.uploadService.saveFile(audio, audioHashCode), this.uploadService.saveFile(video, videoHashCode)).pipe(
      concatMap(() => this.http.put(API + '/musiques', music)
      ));
  }

}
