import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DiffusionRoutingModule } from './diffusion-routing.module';
import { DiffusionComponent } from './diffusion.component';


@NgModule({
  declarations: [DiffusionComponent],
  imports: [
    CommonModule,
    DiffusionRoutingModule
  ]
})
export class DiffusionModule { }
