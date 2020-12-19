import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {Artist} from '../../../models/artist';
import {MatPaginator} from '@angular/material/paginator';
import {MatTable, MatTableDataSource} from '@angular/material/table';
import {MatSort} from '@angular/material/sort';
import {ActivatedRoute, Router} from '@angular/router';
import {MatDialog} from '@angular/material/dialog';
import {ToastrService} from 'ngx-toastr';
import {ArtistService} from '../../../services/artist.service';
import {BreakpointObserver} from '@angular/cdk/layout';
import {merge} from 'rxjs';
import {catchError, map, startWith, switchMap} from 'rxjs/operators';
import {of} from 'rxjs/internal/observable/of';

class Album {
}

@Component({
  selector: 'app-artist-details',
  templateUrl: './artist-details.component.html',
  styleUrls: ['./artist-details.component.css']
})
export class ArtistDetailsComponent implements OnInit, AfterViewInit {

  artist: Artist;
  displayedColumns: any = [];
  dataSource: any = [];
  resultsLength = 0;
  isLoadingResults = true;
  isRateLimitReached = false;

  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;
  @ViewChild(MatTable, {static: true}) table: MatTable<Album>;


  constructor(private router: Router, private route: ActivatedRoute, private artistService: ArtistService, breakpointObserver: BreakpointObserver,
              private dialog: MatDialog, private toastr: ToastrService) {
    this.route.data.subscribe((data: { artist: Artist }) => {
      this.artist = data.artist;
    });

    breakpointObserver.observe(['(max-width: 600px)']).subscribe(result => {
      this.displayedColumns = result.matches ?
        ['cover', 'title', 'date', 'action'] :
        ['cover', 'title', 'date', 'action'];
    });

    this.dataSource = new MatTableDataSource();
  }

  ngOnInit() {
  }

  ngAfterViewInit() {
    this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);
    merge(this.sort.sortChange, this.paginator.page)
      .pipe(
        startWith({}),
        switchMap(() => {
          this.isLoadingResults = true;
          return []; //this.artistService.getAlbums(this.artist.userId);
        }),
        map((data: Album[]) => {
          // Flip flag to show that loading has finished.
          this.isLoadingResults = false;
          this.isRateLimitReached = false;
          this.resultsLength = data.length;
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
