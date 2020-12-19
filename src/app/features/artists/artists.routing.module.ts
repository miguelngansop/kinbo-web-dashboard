import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {ArtistsComponent} from './artists.component';
import {ArtistDetailsComponent} from './artist-details/artist-details.component';
import {ArtistResolver} from '../../resolvers/artist.resolver';


const routes: Routes = [
  {
    path: '',
    component: ArtistsComponent,
    data: {
      title: 'Artistes',
    }
  },
  {
    path: ':id',
    children: [
      {
        path: '',
        component: ArtistDetailsComponent,
        resolve: {
          artist: ArtistResolver
        },
        data: {
          title: "Details sur l'artiste",
          urls: [
            {title: 'Artistes', url: '/artists'},
            {title: 'Details sur l\'artiste'}
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
export class ArtistsRoutingModule { }
