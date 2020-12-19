import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {MusicsComponent} from './musics.component';
import {MusicCreateComponent} from './music-create/music-create.component';

const routes: Routes = [
  {
    path: '',
    component: MusicsComponent,
    data: {
      title: 'Musiques',
    }
  },
  {
    path: 'create',
    component: MusicCreateComponent,
    data: {
      title: 'Ajouter une musique',
    }
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MusicsRoutingModule { }
