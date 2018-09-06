import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { MaterializeModule } from 'angular2-materialize';
import { PresentacionComponent } from './presentacion/presentacion.component';
import { OptionsComponent } from './options/options.component';
/* expectedRole: number Es el id del rol que se encuentra en la base de datos */
const routesVideoWall: Routes = [
  {
    path: '', component: OptionsComponent
  },
  {
    path: 'options', component: OptionsComponent
  },
  {
    path: 'presentacion', component: PresentacionComponent
  }
]
@NgModule({
  imports: [
    CommonModule,
    MaterializeModule,
    RouterModule.forChild(routesVideoWall)
  ],
  declarations: [PresentacionComponent, OptionsComponent]
})
export class VideowallModule { }
