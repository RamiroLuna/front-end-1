import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { MaterializeModule } from 'angular2-materialize';
import { NgPipesModule } from 'ngx-pipes';
import { AuthGuardEtad } from '../auth/auth.guard.etad';
import { OptionsComponent } from './options/options.component';
import { MetaMasivaComponent } from './meta-masiva/meta-masiva.component';
import { ListaMetasComponent } from './lista-metas/lista-metas.component';



const routes: Routes = [
  { path: 'opciones', component: OptionsComponent },
  /* rutas de metas */
  {
    path: 'opciones/metas-carga-masiva', component: MetaMasivaComponent, canActivate: [AuthGuardEtad],
    data: {
      expectedRole: 28
    }
  },
  {
    path: 'opciones/lista-metas', component: ListaMetasComponent, canActivate: [AuthGuardEtad],
    data: {
      expectedRole: 28
    }
  }

];

@NgModule({
  imports: [
    CommonModule,
    MaterializeModule,
    ReactiveFormsModule,
    FormsModule,
    NgPipesModule,
    RouterModule.forChild(routes)
  ],
  declarations: [
    OptionsComponent,
    MetaMasivaComponent,
    ListaMetasComponent
  ],
  providers: [
    AuthGuardEtad
  ]
})
export class EtadModule { }
