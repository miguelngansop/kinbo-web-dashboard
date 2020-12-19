import {Component, Inject, Optional} from '@angular/core';
import {Genre} from '../../../models/genre';
import {FileUpload} from '../../../shared/image-upload/image-upload.component';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {GenreService} from '../../../services/genre.service';
import {ToastrService} from 'ngx-toastr';
import {Md5} from 'ts-md5';

@Component({
  selector: 'app-genre-dialog',
  templateUrl: './genre-dialog.component.html',
  styleUrls: ['./genre-dialog.component.css']
})
export class GenreDialogComponent {

  action: string;
  local_data: Genre;
  loading: boolean = false;

  image = <FileUpload>{};

  constructor(
    public dialogRef: MatDialogRef<GenreDialogComponent>, private genreService: GenreService,
    private toastr: ToastrService,
    //@Optional() is used to prevent error if no data is passed
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any) {
    // console.log(data);
    this.local_data = {...data.obj};
    this.action = data.action;
  }

  doAction() {
    let genre: Genre = {...this.local_data};
    this.loading = true;
    if (this.action == 'Ajouter') {
      let request$;
      if (this.image.url && this.image.file) {
        let hashCode = Md5.hashAsciiStr(this.image.file.name + new Date()).toString();
        request$ = this.genreService.addWithImage(genre, this.image.file, hashCode);
      } else {
        genre.image = null;
        request$ = this.genreService.add(genre);
      }

      request$.subscribe((rep: Genre) => {
        if (rep) {
          this.dialogRef.close({event: this.action, message: 'Nouveau genre musical ajouté', title: 'Operation réussie'});
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
        request$ = this.genreService.updateWithImage(genre, this.image.file, hashCode);
      } else {
        request$ = this.genreService.update(genre);
      }
      request$.subscribe((rep: Genre) => {
        if (rep) {
          this.dialogRef.close({event: this.action, message: 'Genre musical mis à jour', title: 'Operation réussie'});
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
}
