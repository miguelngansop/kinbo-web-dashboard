import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {AlbumsComponent} from './albums.component';
import {AlbumDetailsComponent} from './album-details/album-details.component';
import {AlbumResolver} from '../../resolvers/album.resolver';

const routes: Routes = [
  {
    path: '',
    component: AlbumsComponent,
    data: {
      title: 'Albums',
    }
  },
  {
    path: ':id',
    children: [
      {
        path: '',
        component: AlbumDetailsComponent,
        resolve: {
          album: AlbumResolver
        },
        data: {
          title: 'Details sur l\'album',
          urls: [
            {title: 'Albums', url: '/albums'},
            {title: 'Details sur l\'album'}
          ]
        }
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AlbumsRoutingModule { }
