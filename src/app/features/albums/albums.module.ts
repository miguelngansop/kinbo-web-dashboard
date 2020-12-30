import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {AlbumsRoutingModule} from './albums-routing.module';
import {AlbumsComponent} from './albums.component';
import {DemoMaterialModule} from '../../demo-material-module';
import {AlbumDialogComponent} from './album-dialog/album-dialog.component';
import {ReactiveFormsModule} from '@angular/forms';
import {SharedModule} from '../../shared/shared.module';
import {NgxMatSelectSearchModule} from 'ngx-mat-select-search';
import {AlbumDetailsComponent} from './album-details/album-details.component';


@NgModule({
  declarations: [AlbumsComponent, AlbumDialogComponent, AlbumDetailsComponent],
  imports: [
    CommonModule,
    DemoMaterialModule,
    AlbumsRoutingModule,
    SharedModule,
    ReactiveFormsModule,
    NgxMatSelectSearchModule
  ],
  entryComponents: [AlbumDialogComponent]
})
export class AlbumsModule { }
