import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {Artist} from '../../../models/artist';
import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';
import {MatSort} from '@angular/material/sort';
import {ActivatedRoute, Router} from '@angular/router';
import {MatDialog} from '@angular/material/dialog';
import {ToastrService} from 'ngx-toastr';
import {ArtistService} from '../../../services/artist.service';
import {BreakpointObserver} from '@angular/cdk/layout';
import {merge} from 'rxjs';
import {catchError, map, startWith, switchMap} from 'rxjs/operators';
import {of} from 'rxjs/internal/observable/of';
import {Music} from '../../../models/music';

class Album {
}

@Component({
  selector: 'app-artist-details',
  templateUrl: './artist-details.component.html',
  styleUrls: ['./artist-details.component.css']
})
export class ArtistDetailsComponent implements OnInit, AfterViewInit {

  artist: Artist;
  albumsDisplayedColumns: any = [];
  musicsDisplayedColumns: any = [];

  albumsDataSource: MatTableDataSource<Album>;
  musicsDataSource: MatTableDataSource<Music>;

  albumsLength = 0;
  musicsLength = 0;

  isLoadingAlbumsResults = true;
  isRateLimitAlbumsReached = false;

  isLoadingMusicsResults = true;
  isRateLimitMusicsReached = false;

  @ViewChild('albumPaginator', {static: true}) albumPaginator: MatPaginator;
  @ViewChild('albumsSort', {static: true}) albumSort: MatSort;

  @ViewChild('musicPaginator', {static: true}) musicPaginator: MatPaginator;
  @ViewChild('musicsSort', {static: true}) musicSort: MatSort;


  constructor(private router: Router, private route: ActivatedRoute, private artistService: ArtistService, breakpointObserver: BreakpointObserver,
              private dialog: MatDialog, private toastr: ToastrService) {
    this.route.data.subscribe((data: { artist: Artist }) => {
      this.artist = data.artist;
    });

    breakpointObserver.observe(['(max-width: 600px)']).subscribe(result => {
      this.albumsDisplayedColumns = result.matches ?
        ['cover', 'title', 'date', 'action'] :
        ['cover', 'title', 'date', 'action'];

      this.musicsDisplayedColumns = result.matches ?
        ['id', 'cover', 'name', 'album', 'genre', 'price', 'date', 'action'] :
        ['id', 'cover', 'name', 'album', 'genre', 'price', 'date', 'action'];
    });

    this.albumsDataSource = new MatTableDataSource();
    this.musicsDataSource = new MatTableDataSource();
  }

  ngOnInit() {
  }

  ngAfterViewInit() {
    //Albums
    this.albumSort.sortChange.subscribe(() => this.albumPaginator.pageIndex = 0);
    merge(this.albumSort.sortChange, this.albumPaginator.page)
      .pipe(
        startWith({}),
        switchMap(() => {
          this.isLoadingAlbumsResults = true;
          return this.artistService.getAlbums(this.artist.id);
        }),
        map((data: Album[]) => {
          // Flip flag to show that loading has finished.
          this.isLoadingAlbumsResults = false;
          this.isRateLimitAlbumsReached = false;
          this.albumsLength = data.length;
          return data;
        }),
        catchError(() => {
          this.isLoadingAlbumsResults = false;
          // Catch if the API has reached its rate limit. Return empty data.
          this.isRateLimitAlbumsReached = true;
          // alert(err);
          return of([]);
        })
      ).subscribe(data => this.albumsDataSource.data = data);

    this.albumsDataSource.paginator = this.albumPaginator;
    this.albumsDataSource.sort = this.albumSort;

    //Music
    this.musicSort.sortChange.subscribe(() => this.musicPaginator.pageIndex = 0);
    merge(this.musicSort.sortChange, this.musicPaginator.page)
      .pipe(
        startWith({}),
        switchMap(() => {
          this.isLoadingMusicsResults = true;
          return this.artistService.getMusics(this.artist.id);
        }),
        map((data: Music[]) => {
          // Flip flag to show that loading has finished.
          this.isLoadingMusicsResults = false;
          this.isRateLimitMusicsReached = false;
          this.musicsLength = data.length;
          return data;
        }),
        catchError(() => {
          this.isLoadingMusicsResults = false;
          // Catch if the API has reached its rate limit. Return empty data.
          this.isRateLimitMusicsReached = true;
          // alert(err);
          return of([]);
        })
      ).subscribe(data => this.musicsDataSource.data = data);

    this.musicsDataSource.paginator = this.musicPaginator;
    this.musicsDataSource.sort = this.musicSort;
  }

  openDialog(action, obj) {
    const dialogRef = this.dialog.open(null, {
      data: {
        obj: obj,
        action: action
      },
      autoFocus: true
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (result.event != 'Cancel') {
          this.ngAfterViewInit();
          if (result.event == 'Ajouter') {
            this.toastr.success('Nouveau contrat ajouté', 'Operation réussie');
          }
          if (result.event == 'Modifier') {
            this.toastr.success('Album modifié', 'Operation réussie');
          }
          if (result.event == 'Supprimer') {
            this.toastr.success('Album supprimé', 'Operation réussie');
          }
        }
      }
    });
  }
}
