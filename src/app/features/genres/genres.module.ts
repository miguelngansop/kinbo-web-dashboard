import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {GenresRoutingModule} from './genres-routing.module';
import {GenresComponent} from './genres.component';
import {DemoMaterialModule} from '../../demo-material-module';
import {GenreDialogComponent} from './genre-dialog/genre-dialog.component';
import {SharedModule} from '../../shared/shared.module';
import {FormsModule} from '@angular/forms';


@NgModule({
  declarations: [GenresComponent, GenreDialogComponent],
  imports: [
    CommonModule,
    DemoMaterialModule,
    SharedModule,
    GenresRoutingModule,
    FormsModule
  ],
  entryComponents: [GenreDialogComponent]
})
export class GenresModule { }
