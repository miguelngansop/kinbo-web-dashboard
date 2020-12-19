import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {MusicsRoutingModule} from './musics-routing.module';
import {MusicsComponent} from './musics.component';
import {MusicCreateComponent} from './music-create/music-create.component';
import {DemoMaterialModule} from '../../demo-material-module';
import {MusicDialogComponent} from './music-dialog/music-dialog.component';
import {QuillModule} from 'ngx-quill';
import {SharedModule} from '../../shared/shared.module';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {FileUploadModule} from 'ng2-file-upload';
import {MatSelectModule} from '@angular/material/select';
import {MatFormFieldModule} from '@angular/material/form-field';
import {NgxMatSelectSearchModule} from 'ngx-mat-select-search';
import {MusicDetailsComponent} from './music-details/music-details.component';


@NgModule({
  declarations: [MusicsComponent, MusicCreateComponent, MusicDialogComponent, MusicDetailsComponent],
  imports: [
    CommonModule,
    DemoMaterialModule,
    MusicsRoutingModule,
    QuillModule.forRoot(),
    SharedModule,
    FormsModule,
    FileUploadModule,
    MatSelectModule,
    MatFormFieldModule,
    NgxMatSelectSearchModule,
    ReactiveFormsModule
  ]
})
export class MusicsModule { }
