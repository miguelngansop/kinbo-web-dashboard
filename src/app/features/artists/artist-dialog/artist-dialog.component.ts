import {Component, Inject, OnInit, Optional} from '@angular/core';
import {FileUpload} from '../../../shared/image-upload/image-upload.component';
import {Artist} from '../../../models/artist';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {ToastrService} from 'ngx-toastr';
import {Md5} from 'ts-md5';
import {ArtistService} from '../../../services/artist.service';

@Component({
  selector: 'app-artist-dialog',
  templateUrl: './artist-dialog.component.html',
  styleUrls: ['./artist-dialog.component.css']
})
export class ArtistDialogComponent {

  action: string;
  local_data: Artist;
  loading: boolean = false;

  image = <FileUpload> {};

  constructor(
    public dialogRef: MatDialogRef<ArtistDialogComponent>, private artistService: ArtistService,
    private toastr: ToastrService,
    //@Optional() is used to prevent error if no data is passed
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any) {
    // console.log(data);
    this.local_data = {...data.obj};
    this.action = data.action;
  }

  doAction() {
    let artist: Artist = {...this.local_data};
    // Artist.userPasswordHash = Artist.userPasswordHash ? bcrypt.hashSync(this.local_data.userPasswordHash, 10) : undefined;
    this.loading = true;
    if (this.action == 'Ajouter') {
      let request$;
      if (this.image.url && this.image.file) {
        let hashCode = Md5.hashAsciiStr(this.image.file.name + new Date()).toString();
        request$ = this.artistService.addWithImage(artist, this.image.file, hashCode);
      } else {
        artist.imagePersonne = null;
        request$ = this.artistService.add(artist);
      }

      request$.subscribe((rep: Artist) => {
        if (rep) {
          this.dialogRef.close({event: this.action, message: 'Nouvel artiste ajouté', title: 'Operation réussie'});
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
        request$ = this.artistService.updateWithImage(artist, this.image.file, hashCode);
      } else {
        request$ = this.artistService.update(artist);
      }
      request$.subscribe((rep: Artist) => {
        if (rep) {
          this.dialogRef.close({event: this.action, message: 'Artiste mis à jour', title: 'Operation réussie'});
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
