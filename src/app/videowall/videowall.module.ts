import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { MaterializeModule } from 'angular2-materialize';
import { PresentacionComponent } from './presentacion/presentacion.component';
import { OptionsComponent } from './options/options.component';
import { AuthGuardVideoWall } from '../auth/auth.guard.video.wall';
import { FormatoEnlaceComponent } from '../../app/etad/formato-enlace/formato-enlace.component';
/* expectedRole: number Es el id del rol que se encuentra en la base de datos */
const routesVideoWall: Routes = [
  {
    path: '', component: OptionsComponent, canActivate: [AuthGuardVideoWall],
    data: {
      expectedRole: 56
    }
  },
  {
    path: 'options', component: OptionsComponent, canActivate: [AuthGuardVideoWall],
    data: {
      expectedRole: 56
    }
  },
  {
    path: 'presentacion', component: PresentacionComponent, canActivate: [AuthGuardVideoWall],
    data: {
      expectedRole: 56
    }
  }
]
@NgModule({
  imports: [
    CommonModule,
    MaterializeModule,
    ReactiveFormsModule, 
    FormsModule,
    RouterModule.forChild(routesVideoWall)
  ],
  providers: [
    AuthGuardVideoWall
  ],
  declarations: [PresentacionComponent, OptionsComponent, FormatoEnlaceComponent]
})
export class VideowallModule { }
