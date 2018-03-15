import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule} from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { MaterializeModule } from 'angular2-materialize';
import { ListSonarhUsersComponent } from './list-sonarh-users/list-sonarh-users.component';
import { ListEtadUsersComponent } from './list-etad-users/list-etad-users.component';
import { DetailsUsersComponent } from './details-users/details-users.component';
import { PerfilComponent } from './perfil/perfil.component';
import { PerfilEtadComponent } from './perfil-etad/perfil-etad.component';

const routesUsuarios: Routes = [
  { path: 'sonarh', component: ListSonarhUsersComponent },
  { path: 'etad', component: ListEtadUsersComponent },
  { path: 'usuario/:id', component: DetailsUsersComponent },
  { path: 'usuario-etad/:id', component: PerfilEtadComponent },
  { path: 'perfil/:id', component: PerfilComponent }
];

@NgModule({
  imports: [
    CommonModule,
    MaterializeModule,
    ReactiveFormsModule,
    FormsModule,
    RouterModule.forChild(routesUsuarios)
  ],
  declarations: [ListSonarhUsersComponent, ListEtadUsersComponent, DetailsUsersComponent, PerfilComponent, PerfilEtadComponent]
})
export class UsersModule { }
