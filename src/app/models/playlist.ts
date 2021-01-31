import {Artist} from './artist';
import {Genre} from './genre';
import {Album} from './album';
import {Music} from './music';

export class Playlist {
  id: string;
  nom: string;
  type: string;
  isprivate: Album;
  musiques: Music[];
}
