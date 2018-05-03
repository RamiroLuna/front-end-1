import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { MaterializeModule } from 'angular2-materialize';
import { ListSonarhUsersComponent } from './list-sonarh-users/list-sonarh-users.component';
import { ListEtadUsersComponent } from './list-etad-users/list-etad-users.component';
import { PerfilSonarhComponent } from './perfil-sonarh/perfil-sonarh.component';
import { PerfilComponent } from './perfil/perfil.component';
import { PerfilEtadComponent } from './perfil-etad/perfil-etad.component';
import { AuthGuardUsers } from '../auth/auth.guard.users';
/* expectedRole: number Es el id del rol que se encuentra en la base de datos */
const routesUsuarios: Routes = [
  {
    path: 'sonarh', component: ListSonarhUsersComponent, canActivate: [AuthGuardUsers],
    data: {
      expectedRole: 10
    }
  },
  {
    path: 'etad', component: ListEtadUsersComponent, canActivate: [AuthGuardUsers],
    data: {
      expectedRole: 14
    }
  },
  {
    path: 'usuario-sonarh/:id', component: PerfilSonarhComponent, canActivate: [AuthGuardUsers],
    data: {
      expectedRole: 11
    }
  },
  {
    path: 'usuario-etad/:id', component: PerfilEtadComponent, canActivate: [AuthGuardUsers],
    data: {
      expectedRole: 15
    }
  },
  {
    path: 'perfil/:id', component: PerfilComponent, canActivate: [AuthGuardUsers],
    data: {
      expectedRole: 16
    }
  }
];

@NgModule({
  imports: [
    CommonModule,
    MaterializeModule,
    ReactiveFormsModule,
    FormsModule,
    RouterModule.forChild(routesUsuarios)
  ],
  declarations: [
    ListSonarhUsersComponent,
    ListEtadUsersComponent,
    PerfilSonarhComponent,
    PerfilComponent,
    PerfilEtadComponent
  ],
  providers: [
    AuthGuardUsers
  ]
})
export class UsersModule { }
