import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ArtistsComponent } from './artists.component';
import {ArtistsRoutingModule} from './artists.routing.module';
import {SharedModule} from '../../shared/shared.module';
import {DemoMaterialModule} from '../../demo-material-module';
import { ArtistDialogComponent } from './artist-dialog/artist-dialog.component';
import {FormsModule} from '@angular/forms';
import { ArtistDetailsComponent } from './artist-details/artist-details.component';

@NgModule({
  declarations: [ArtistsComponent, ArtistDialogComponent, ArtistDetailsComponent],
  imports: [
    CommonModule,
    SharedModule,
    DemoMaterialModule,
    ArtistsRoutingModule,
    FormsModule
  ],
  entryComponents :[ArtistDialogComponent]
})
export class ArtistsModule { }
