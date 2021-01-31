import {Component, OnInit} from '@angular/core';
import {AlbumService} from '../../services/album.service';
import {ArtistService} from '../../services/artist.service';
import {MusicService} from '../../services/music.service';
import {UserService} from '../../services/user.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  countAlbums = 0;
  countMusics = 0;
  countArtists = 0;
  countUsers = 0;

  constructor(private albumService: AlbumService, private artistService: ArtistService, private musicService: MusicService, private userService: UserService) {
  }

  ngOnInit(): void {
    this.artistService.count().subscribe((rep: number) => this.countArtists = rep);
    this.albumService.count().subscribe((rep: number) => this.countAlbums = rep);
    this.musicService.count().subscribe((rep: number) => this.countMusics = rep);
    this.userService.count().subscribe((rep: number) => this.countUsers = rep);
  }

}
