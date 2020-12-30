import {Component, Inject, Optional} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {ToastrService} from 'ngx-toastr';
import {MusicService} from '../../../services/music.service';
import {Music} from '../../../models/music';

@Component({
  selector: 'app-music-dialog',
  templateUrl: './music-dialog.component.html',
  styleUrls: ['./music-dialog.component.css']
})
export class MusicDialogComponent {

  action: string;
  local_data: Music;
  loading: boolean = false;

  constructor(
    public dialogRef: MatDialogRef<MusicDialogComponent>, private musicService: MusicService,
    private toastr: ToastrService,
    //@Optional() is used to prevent error if no data is passed
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any) {

    this.local_data = {...data.obj};
    this.action = data.action;
  }


  doAction() {
    console.log('Delet music');
  }

  closeDialog() {
    this.dialogRef.close({event: 'Cancel'});
  }
}
