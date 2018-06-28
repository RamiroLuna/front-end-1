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
import { PipesCustomModule } from '../pipes/pipes.custom.module';
import { MetaManualComponent } from './meta-manual/meta-manual.component';
import { ListCatalogsComponent } from './list-catalogs/list-catalogs.component';
import { ListByCatalogComponent } from './list-by-catalog/list-by-catalog.component';



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
  },
  {
    path: 'opciones/metas-carga-manual/:id', component: MetaManualComponent
    // , canActivate: [AuthGuardEtad]
    // data: {
    //   expectedRole: 
    // }
  },
  /* rutas de catalogos */
  {
    path: 'opciones/catalogos', component: ListCatalogsComponent
    // , canActivate: [AuthGuardEtad]
    // data: {
    //   expectedRole: 
    // }
  },
  {
    path: 'opciones/catalogos/:name', component: ListByCatalogComponent
    // , canActivate: [AuthGuardEtad]
    // data: {
    //   expectedRole: 
    // }
  }

];

@NgModule({
  imports: [
    CommonModule,
    MaterializeModule,
    ReactiveFormsModule,
    FormsModule,
    NgPipesModule,
    PipesCustomModule,
    RouterModule.forChild(routes)
  ],
  declarations: [
    OptionsComponent,
    MetaMasivaComponent,
    ListaMetasComponent,
    MetaManualComponent,
    ListCatalogsComponent,
    ListByCatalogComponent
  ],
  providers: [
    AuthGuardEtad
  ]
})
export class EtadModule { }
