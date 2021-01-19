import {Component, Inject, OnInit, Optional, ViewChild} from '@angular/core';
import {Diffusion} from '../../../models/diffusion';
import {MatTable, MatTableDataSource} from '@angular/material/table';
import {Music} from '../../../models/music';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {SelectionModel} from '@angular/cdk/collections';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {DiffusionService} from '../../../services/diffusion.service';
import {ToastrService} from 'ngx-toastr';
import {MusicService} from '../../../services/music.service';
import {merge} from 'rxjs';
import {catchError, map, startWith, switchMap} from 'rxjs/operators';
import {of} from 'rxjs/internal/observable/of';

@Component({
  selector: 'app-diffusion-dialog',
  templateUrl: './diffusion-dialog.component.html',
  styleUrls: ['./diffusion-dialog.component.css']
})
export class DiffusionDialogComponent {

  action: string;
  local_data: Diffusion;
  loading: boolean = false;

  musicsDisplayedColumns: any = ['select', 'cover', 'name', 'genre', 'price', 'date'];
  musicsDataSource: MatTableDataSource<Music>;
  musicsLength = 0;

  isLoadingMusicsResults = true;
  isRateLimitMusicsReached = false;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatTable) table: MatTable<any>;


  selection = new SelectionModel<Music>(true, []);

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.musicsDataSource.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected() ?
      this.selection.clear() :
      this.musicsDataSource.data.forEach(row => this.selection.select(row));
  }


  constructor(
    public dialogRef: MatDialogRef<DiffusionDialogComponent>, private diffusionService: DiffusionService,
    private toastr: ToastrService, private musicService: MusicService,
    //@Optional() is used to prevent error if no data is passed
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any) {
    // console.log(data);
    this.local_data = {...data.obj};
    this.action = data.action;

    this.musicsDataSource = new MatTableDataSource();
  }

  doAction() {
    let diffusion: Diffusion = {...this.local_data};
    this.loading = true;
    if (this.action == 'Ajouter') {
      diffusion.musiques = this.selection.selected;
      this.diffusionService.add(diffusion).subscribe((rep: Diffusion) => {
        if (rep) {
          this.dialogRef.close({event: this.action, message: 'Nouvelle diffusion ajoutée', title: 'Operation réussie'});
        }
        this.loading = false;
      }, (err => {
        this.toastr.error('Verifier vos champs', 'Erreur');
        this.loading = false;
      }));
    }

    if (this.action == 'Modifier') {
      let request$;

      request$.subscribe((rep: Diffusion) => {
        if (rep) {
          this.dialogRef.close({event: this.action, message: 'Diffusion mis à jour', title: 'Operation réussie'});
        }
        this.loading = false;
      }, (err => {
        this.toastr.error('Verifier vos champs', 'Erreur');
        this.loading = false;
      }));
    }
  }

  closeDialog() {
    this.dialogRef.close({event: 'Cancel'});
  }

  ngAfterViewInit() {
    //Music
    this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);
    merge(this.sort.sortChange, this.paginator.page)
      .pipe(
        startWith({}),
        switchMap(() => {
          this.isLoadingMusicsResults = true;
          return this.musicService.getAll();
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

    this.musicsDataSource.paginator = this.paginator;
    this.musicsDataSource.sort = this.sort;
  }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
    this.musicsDataSource.filter = filterValue;
  }

}
