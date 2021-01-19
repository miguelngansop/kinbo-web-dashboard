import {Component, Inject, OnDestroy, OnInit, Optional, ViewChild} from '@angular/core';
import {Album} from '../../../models/album';
import {FileUpload} from '../../../shared/image-upload/image-upload.component';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {AlbumService} from '../../../services/album.service';
import {ToastrService} from 'ngx-toastr';
import {Md5} from 'ts-md5';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {ReplaySubject, Subject} from 'rxjs';
import {Artist} from '../../../models/artist';
import {concatMap, debounceTime, delay, filter, takeUntil, tap} from 'rxjs/operators';
import {ArtistService} from '../../../services/artist.service';
import {MatSelect} from '@angular/material/select';

@Component({
  selector: 'app-album-dialog',
  templateUrl: './album-dialog.component.html',
  styleUrls: ['./album-dialog.component.css']
})
export class AlbumDialogComponent implements OnInit, OnDestroy {

  action: string;
  local_data: Album;
  loading: boolean = false;
  form: FormGroup;
  maxDate = new Date();

  image = <FileUpload>{};
  artists: Artist[] = [];


  /** control for the selected artist for server side filtering */
  public artistServerSideCtrl: FormControl = new FormControl();

  /** control for filter for server side. */
  public artistServerSideFilteringCtrl: FormControl = new FormControl();

  /** indicate search operation is in progress */
  public searchingArtist = false;

  /** list of artists filtered after simulating server side search */
  public filteredServerSideArtists: ReplaySubject<Artist[]> = new ReplaySubject<Artist[]>(1);

  /** Subject that emits when the component has been destroyed. */
  protected _onDestroyArtist = new Subject<void>();

  @ViewChild('artistSelect') artistSelect: MatSelect;

  constructor(
    public dialogRef: MatDialogRef<AlbumDialogComponent>, private albumService: AlbumService,
    private toastr: ToastrService, private  fb: FormBuilder, private artistService: ArtistService,
    //@Optional() is used to prevent error if no data is passed
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any) {
    // console.log(data);
    this.local_data = {...data.obj};
    this.action = data.action;

    // Init data
    if (this.action == 'Modifier') {
      this.artists.push(this.local_data.artiste);
    }
  }

  ngOnInit() {

    this.form = this.fb.group({
      'titre': [this.local_data?.titre, Validators.required],
      'artiste': [this.local_data?.artiste, Validators.required],
      'dateCreation': [this.local_data?.dateCreation, Validators.required],
    });

    if (this.action == 'Modifier') {
      // set initial selection
      this.artistServerSideCtrl.setValue(this.local_data?.artiste);

      // load the initial list
      this.filteredServerSideArtists.next(this.artists.slice());
    }

    // listen for search field value changes
    this.artistServerSideFilteringCtrl.valueChanges
      .pipe(
        filter(search => !!search),
        tap(() => this.searchingArtist = true),
        takeUntil(this._onDestroyArtist),
        debounceTime(200),
        concatMap((search) => this.artistService.searchByName(search)),
        delay(500),
        takeUntil(this._onDestroyArtist)
      )
      .subscribe((filteredArtists: Artist[]) => {
          this.searchingArtist = false;
          this.filteredServerSideArtists.next(filteredArtists);
        },
        error => {
          // no errors in our simulated example
          this.searchingArtist = false;
          // handle error...
        });
  }

  doAction() {
    let album: Album = {...this.form.value};
    this.loading = true;
    if (this.action == 'Ajouter') {
      let request$;
      if (this.image.url && this.image.file) {
        let hashCode = Md5.hashAsciiStr(this.image.file.name + new Date()).toString();
        request$ = this.albumService.addWithImage(album, this.image.file, hashCode);
      } else {
        album.image = null;
        request$ = this.albumService.add(album);
      }

      request$.subscribe((rep: Album) => {
        if (rep) {
          this.dialogRef.close({event: this.action, message: 'Nouvel album ajouté', title: 'Operation réussie'});
        }
        this.loading = false;
      }, (err => {
        this.toastr.error('Verifier vos champs', 'Erreur');
        this.loading = false;
      }));
    }

    if (this.action == 'Modifier') {
      let request$;
      if (this.image.url && this.image.file) {
        let hashCode = Md5.hashAsciiStr(this.image.file.name + new Date()).toString();
        request$ = this.albumService.updateWithImage(album, this.image.file, hashCode);
      } else {
        request$ = this.albumService.update(album);
      }
      request$.subscribe((rep: Album) => {
        if (rep) {
          this.dialogRef.close({event: this.action, message: 'Album mis à jour', title: 'Operation réussie'});
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

  ngOnDestroy() {
    this._onDestroyArtist.next();
    this._onDestroyArtist.complete();
  }
}
