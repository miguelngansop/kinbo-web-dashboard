import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {MusicService} from '../../../services/music.service';
import {BreakpointObserver} from '@angular/cdk/layout';
import {MatDialog} from '@angular/material/dialog';
import {ToastrService} from 'ngx-toastr';
import {Music} from '../../../models/music';
import {Album} from '../../../models/album';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import {merge} from 'rxjs';
import {catchError, map, startWith, switchMap} from 'rxjs/operators';
import {of} from 'rxjs/internal/observable/of';
import {ArtistService} from '../../../services/artist.service';
import {SelectionModel} from '@angular/cdk/collections';

@Component({
  selector: 'app-album-details',
  templateUrl: './album-details.component.html',
  styleUrls: ['./album-details.component.css']
})
export class AlbumDetailsComponent implements OnInit, AfterViewInit {

  album: Album;
  musicsLength = 0;

  musicsDisplayedColumns: any = [];
  musicsDataSource: MatTableDataSource<Music>;

  isLoadingMusicsResults = true;
  isRateLimitMusicsReached = false;

  @ViewChild('musicPaginator', {static: true}) musicPaginator: MatPaginator;
  @ViewChild('musicsSort', {static: true}) musicSort: MatSort;

  noAlbumMusicsLength = 0;

  noAlbumMusicsDisplayedColumns: any = [];
  noAlbumMusicsDataSource: MatTableDataSource<Music>;

  isLoadingnoAlbumMusicsResults = true;
  isRateLimitnoAlbumMusicsReached = false;

  @ViewChild('noAlbumMusicPaginator', {static: true}) noAlbumMusicPaginator: MatPaginator;
  @ViewChild('noAlbumMusicsSort', {static: true}) noAlbumMusicSort: MatSort;
  selection = new SelectionModel<Music>(true, []);

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.noAlbumMusicsDataSource.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected() ?
      this.selection.clear() :
      this.noAlbumMusicsDataSource.data.forEach(row => this.selection.select(row));
  }

  constructor(private router: Router, private route: ActivatedRoute, private musicService: MusicService, breakpointObserver: BreakpointObserver,
              private dialog: MatDialog, private toastr: ToastrService, private artistService: ArtistService) {
    this.route.data.subscribe((data: { album: Album }) => {
      this.album = data.album;
    });

    breakpointObserver.observe(['(max-width: 600px)']).subscribe(result => {
      this.noAlbumMusicsDisplayedColumns = result.matches ?
        ['select', 'cover', 'name', 'genre', 'price', 'date', 'action'] :
        ['select', 'cover', 'name', 'genre', 'price', 'date', 'action'];

      this.musicsDisplayedColumns = result.matches ?
        ['id', 'cover', 'name', 'album', 'genre', 'price', 'date', 'action'] :
        ['id', 'cover', 'name', 'album', 'genre', 'price', 'date', 'action'];
    });

    this.musicsDataSource = new MatTableDataSource();
    this.noAlbumMusicsDataSource = new MatTableDataSource();
  }

  ngOnInit(): void {
  }

  ngAfterViewInit() {
    //Music
    this.musicSort.sortChange.subscribe(() => this.musicPaginator.pageIndex = 0);
    merge(this.musicSort.sortChange, this.musicPaginator.page)
      .pipe(
        startWith({}),
        switchMap(() => {
          this.isLoadingMusicsResults = true;
          return this.musicService.getMusicsOfAlbum(this.album?.id);
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

    //noAlbumMusic
    this.noAlbumMusicSort.sortChange.subscribe(() => this.noAlbumMusicPaginator.pageIndex = 0);
    merge(this.noAlbumMusicSort.sortChange, this.noAlbumMusicPaginator.page)
      .pipe(
        startWith({}),
        switchMap(() => {
          this.isLoadingnoAlbumMusicsResults = true;
          return this.artistService.getNoAlbumMusics(this.album?.artiste?.id);
        }),
        map((data: Music[]) => {
          // Flip flag to show that loading has finished.
          this.isLoadingnoAlbumMusicsResults = false;
          this.isRateLimitnoAlbumMusicsReached = false;
          this.noAlbumMusicsLength = data.length;
          return data;
        }),
        catchError(() => {
          this.isLoadingnoAlbumMusicsResults = false;
          // Catch if the API has reached its rate limit. Return empty data.
          this.isRateLimitnoAlbumMusicsReached = true;
          // alert(err);
          return of([]);
        })
      ).subscribe(data => this.noAlbumMusicsDataSource.data = data);

    this.noAlbumMusicsDataSource.paginator = this.noAlbumMusicPaginator;
    this.noAlbumMusicsDataSource.sort = this.noAlbumMusicSort;
  }

  addMusicsToAlbums() {
    this.musicService.saveMusicsInAlbum(this.album?.id, this.selection.selected).subscribe(rep => {
      location.reload();
    });
  }
}
