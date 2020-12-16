import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {DiffusionComponent} from './diffusion.component';

const routes: Routes = [
  {
    path: '',
    component: DiffusionComponent,
    data: {
      title: 'Programme de diffusion',
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DiffusionRoutingModule { }
