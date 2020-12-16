import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {MusicsComponent} from './musics.component';

const routes: Routes = [
  {
    path: '',
    component: MusicsComponent,
    data: {
      title: 'Musiques',
    }
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MusicsRoutingModule { }
