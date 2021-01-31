import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {PlaylistsRoutingModule} from './playlists-routing.module';
import {PlaylistsComponent} from './playlists.component';
import {DemoMaterialModule} from '../../demo-material-module';
import {PlaylistDetailsComponent} from './playlist-details/playlist-details.component';
import {PlaylistDialogComponent} from './playlist-dialog/playlist-dialog.component';
import {FormsModule} from '@angular/forms';


@NgModule({
  declarations: [PlaylistsComponent, PlaylistDetailsComponent, PlaylistDialogComponent],
  imports: [
    CommonModule,
    PlaylistsRoutingModule,
    DemoMaterialModule,
    FormsModule
  ],
  entryComponents: [PlaylistDialogComponent]
})
export class PlaylistsModule { }
