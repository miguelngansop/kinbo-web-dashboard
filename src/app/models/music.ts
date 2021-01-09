import {Artist} from './artist';
import {Genre} from './genre';
import {Album} from './album';

export class Music {
  id: string;
  nom: string;
  artiste: Artist;
  album: Album;
  playlists;
  prix: number;
  audioURL: string;
  videoURL: string;
  streamURL: string;
  dateCreation: string;
  image: string;
  lyric: string;
  genre: Genre;
}
