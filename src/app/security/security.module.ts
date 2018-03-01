import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { MaterializeModule } from 'angular2-materialize';
import { ListSonarhUsersComponent } from './list-sonarh-users/list-sonarh-users.component';
import { ListEtadUsersComponent } from './list-etad-users/list-etad-users.component';
import { DetailsUsersComponent } from './details-users/details-users.component';

const routesUsuarios: Routes = [
  { path: 'sonarh', component: ListSonarhUsersComponent },
  { path: 'etad', component: ListEtadUsersComponent },
  { path: 'usuario/:id', component: DetailsUsersComponent }
];

@NgModule({
  imports: [
    CommonModule,
    MaterializeModule,
    RouterModule.forChild(routesUsuarios)
  ],
  declarations: [ListSonarhUsersComponent, ListEtadUsersComponent, DetailsUsersComponent]
})
export class SecurityModule { }
