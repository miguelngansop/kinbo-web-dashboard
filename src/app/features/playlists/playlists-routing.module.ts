import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {PlaylistsComponent} from './playlists.component';

const routes: Routes = [
  {
    path: '',
    component: PlaylistsComponent,
    data: {
      title: 'Playlists',
    }
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PlaylistsRoutingModule { }
