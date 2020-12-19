import {RouterModule, Routes} from '@angular/router';
import { FullComponent } from './layouts/full/full.component';
import {MaterialComponentsModule} from './material-component/material.module';
import {NgModule} from '@angular/core';
import {AuthGuard} from './guards/auth.guard';
import {AppBlankComponent} from './layouts/blank/blank.component';
import {AuthenticationModule} from './authentication/authentication.module';
import {ArtistsModule} from './features/artists/artists.module';
import {DashboardModule} from './features/dashboard/dashboard.module';
import {GenresModule} from './features/genres/genres.module';
import {MusicsModule} from './features/musics/musics.module';
import {AlbumsModule} from './features/albums/albums.module';
import {PlaylistsModule} from './features/playlists/playlists.module';
import {DiffusionModule} from './features/diffusion/diffusion.module';

export const AppRoutes: Routes = [
  {
    path: '',
    canActivate: [AuthGuard],
    component: FullComponent,
    runGuardsAndResolvers: 'always',
    children: [
      {
        path: '',
        redirectTo: '/dashboard',
        pathMatch: 'full'
      },
      {
        path: 'dashboard',
        loadChildren: () => DashboardModule
      },
      {
        path: 'material',
        loadChildren: () => MaterialComponentsModule
      },
      {
        path: 'artists',
        loadChildren: () => ArtistsModule
      },
      {
        path: 'genres',
        loadChildren: () => GenresModule
      },
      {
        path: 'musics',
        loadChildren: () => MusicsModule
      },
      {
        path: 'albums',
        loadChildren: () => AlbumsModule
      },
      {
        path: 'playlists',
        loadChildren: () => PlaylistsModule
      },
      {
        path: 'diffusion',
        loadChildren: () => DiffusionModule
      }
    ]
  },
  {
    path: '',
    component: AppBlankComponent,
    children: [
      {
        path: '',
        loadChildren: () => AuthenticationModule
      }
    ]
  },
  {
    path: '**',
    redirectTo: '404'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(AppRoutes, { onSameUrlNavigation: 'reload', relativeLinkResolution: 'legacy' })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
