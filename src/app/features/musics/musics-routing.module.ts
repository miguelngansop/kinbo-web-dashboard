import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {MusicsComponent} from './musics.component';
import {MusicCreateComponent} from './music-create/music-create.component';
import {MusicDetailsComponent} from './music-details/music-details.component';
import {MusicResolver} from '../../resolvers/music.resolver';

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
  {
    path: ':id',
    children: [
      {
        path: '',
        component: MusicDetailsComponent,
        resolve: {
          music: MusicResolver
        },
        data: {
          title: 'Details sur la musique',
          urls: [
            {title: 'Musiques', url: '/musics'},
            {title: 'Details sur la musique'}
          ]
        }
      },
      {
        path: 'edit',
        component: MusicCreateComponent,
        data: {
          title: 'Modifier une musique',
        },
        resolve: {
          music: MusicResolver
        },
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MusicsRoutingModule { }
