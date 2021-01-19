import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {DiffusionRoutingModule} from './diffusion-routing.module';
import {DiffusionComponent} from './diffusion.component';
import {DemoMaterialModule} from '../../demo-material-module';
import {DiffusionDialogComponent} from './diffusion-dialog/diffusion-dialog.component';


@NgModule({
  declarations: [DiffusionComponent, DiffusionDialogComponent],
  imports: [
    CommonModule,
    DiffusionRoutingModule,
    DemoMaterialModule
  ],
  entryComponents: [DiffusionDialogComponent]
})
export class DiffusionModule { }
