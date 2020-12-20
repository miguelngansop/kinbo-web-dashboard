import {Artist} from './artist';
import {Genre} from './genre';

export class Music {
  id: string;
  nom: string;
  artiste: Artist;
  playlists;
  prix: number;
  audioURL: string;
  videoURL: string;
  dateCreation: string;
  image: string;
  lyrics: string;
  genre: Genre;
}
