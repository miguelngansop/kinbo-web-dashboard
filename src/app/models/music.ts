import {Artist} from './artist';
import {Genre} from './genre';

export class Music {
  id: string;
  nom: string;
  artiste: Artist;
  playlists;
  prix: number;
  audiourl: string;
  videourl: string;
  typeMedia: string;
  dateCreation: string;
  image: string;
  lyrics: string;
  genre: Genre;
}
