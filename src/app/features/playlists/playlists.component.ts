import {Component, OnInit, ViewChild} from '@angular/core';
import {MatTable, MatTableDataSource} from '@angular/material/table';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {BreakpointObserver} from '@angular/cdk/layout';
import {Router} from '@angular/router';
import {ToastrService} from 'ngx-toastr';
import {MatDialog} from '@angular/material/dialog';
import {merge} from 'rxjs';
import {catchError, map, startWith, switchMap} from 'rxjs/operators';
import {of} from 'rxjs/internal/observable/of';
import {Playlist} from '../../models/playlist';
import {PlaylistService} from '../../services/playlist.service';
import {PlaylistDialogComponent} from './playlist-dialog/playlist-dialog.component';

@Component({
  selector: 'app-playlists',
  templateUrl: './playlists.component.html',
  styleUrls: ['./playlists.component.css']
})
export class PlaylistsComponent implements OnInit {

  displayedColumns = [];
  dataSource: MatTableDataSource<Playlist>;

  newPlaylistsSize: number = 0;

  resultsLength = 0;
  isLoadingResults = true;
  isRateLimitReached = false;

  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;
  @ViewChild(MatTable, {static: true}) table: MatTable<any>;

  constructor(breakpointObserver: BreakpointObserver, private playlistService: PlaylistService, private router: Router,
              private toastr: ToastrService, public dialog: MatDialog) {

    breakpointObserver.observe(['(max-width: 600px)']).subscribe(result => {
      this.displayedColumns = result.matches ?
        ['id', 'name', 'status', 'action'] :
        ['id', 'name', 'status', 'action'];
    });

    // Assign the data to the data source for the table to render
    this.dataSource = new MatTableDataSource();

  }

  /**
   * Set the paginator and sort after the view init since this component will
   * be able to query its view for the initialized paginator and sort.
   */
  ngAfterViewInit() {
    this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);
    merge(this.sort.sortChange, this.paginator.page)
      .pipe(
        startWith({}),
        switchMap(() => {
          this.isLoadingResults = true;
          return this.playlistService.getAll();
        }),
        map((data: Playlist[]) => {
          // Flip flag to show that loading has finished.
          this.isLoadingResults = false;
          this.isRateLimitReached = false;
          this.resultsLength = data.length;
          // this.newUsersSize = data.filter(value => new Date(value.userCreatedAt).getFullYear() === new Date().getFullYear()).length ;
          this.newPlaylistsSize = 0; //data.filter(value => new Date(value.userCreatedAt).getMonth() === new Date().getMonth()).length;
          return data;
        }),
        catchError(() => {
          this.isLoadingResults = false;
          // Catch if the API has reached its rate limit. Return empty data.
          this.isRateLimitReached = true;
          // alert(err);
          return of([]);
        })
      ).subscribe(data => this.dataSource.data = data);

    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  }

  ngOnInit(): void {
  }

  openDialog(action, obj) {
    const dialogRef = this.dialog.open(PlaylistDialogComponent, {
      data: {
        obj: obj,
        action: action
      },
      autoFocus: true,
      width: '900px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (result.event != 'Cancel') {
          this.ngAfterViewInit();
          this.toastr.success(result.message, result.title);
          if (result.event == 'Supprimer') {
            this.toastr.success('Playlist supprimé', 'Operation réussie');
          }
        }
      }
    });
  }
}
