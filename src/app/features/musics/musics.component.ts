import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {MatTable, MatTableDataSource} from '@angular/material/table';
import {Music} from '../../models/music';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {BreakpointObserver} from '@angular/cdk/layout';
import {MusicService} from '../../services/music.service';
import {Router} from '@angular/router';
import {ToastrService} from 'ngx-toastr';
import {MatDialog} from '@angular/material/dialog';
import {merge} from 'rxjs';
import {catchError, map, startWith, switchMap} from 'rxjs/operators';
import {of} from 'rxjs/internal/observable/of';
import {MusicDialogComponent} from './music-dialog/music-dialog.component';

@Component({
  selector: 'app-musics',
  templateUrl: './musics.component.html',
  styleUrls: ['./musics.component.css']
})
export class MusicsComponent implements OnInit, AfterViewInit {

  displayedColumns = ['matricule', 'lastname', 'firstname', 'sex', 'language', 'action'];
  dataSource: MatTableDataSource<Music>;

  newMusicsSize: number = 0;

  resultsLength = 0;
  isLoadingResults = true;
  isRateLimitReached = false;

  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;
  @ViewChild(MatTable, {static: true}) table: MatTable<any>;

  constructor(breakpointObserver: BreakpointObserver, private musicService: MusicService, private router: Router,
              private toastr: ToastrService, public dialog: MatDialog) {

    breakpointObserver.observe(['(max-width: 600px)']).subscribe(result => {
      this.displayedColumns = result.matches ?
        ['id', 'name', 'artist', 'genre', 'price', 'date', 'action'] :
        ['id', 'name', 'artist', 'genre', 'price', 'date', 'action'];
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
          return this.musicService.getAll();
        }),
        map((data: Music[]) => {
          // Flip flag to show that loading has finished.
          this.isLoadingResults = false;
          this.isRateLimitReached = false;
          this.resultsLength = data.length;
          // this.newUsersSize = data.filter(value => new Date(value.userCreatedAt).getFullYear() === new Date().getFullYear()).length ;
          this.newMusicsSize = 0; //data.filter(value => new Date(value.userCreatedAt).getMonth() === new Date().getMonth()).length;

          console.log('Musics', data);
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
    const dialogRef = this.dialog.open(MusicDialogComponent, {
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
          this.toastr.success(result.message, result.title);
          if (result.event == 'Supprimer') {
            this.toastr.success('Musice supprimé', 'Operation réussie');
          }
        }
      }
    });
  }

}
