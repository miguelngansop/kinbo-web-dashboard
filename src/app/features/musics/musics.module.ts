import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MusicsRoutingModule } from './musics-routing.module';
import { MusicsComponent } from './musics.component';


@NgModule({
  declarations: [MusicsComponent],
  imports: [
    CommonModule,
    MusicsRoutingModule
  ]
})
export class MusicsModule { }
