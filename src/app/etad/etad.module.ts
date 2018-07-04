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
import { FormularioDetalleComponent } from './list-by-catalog/formulario-detalle/formulario-detalle.component';
import { PonderacionManualComponent } from './ponderacion-manual/ponderacion-manual.component';
import { PonderacionMasivaComponent } from './ponderacion-masiva/ponderacion-masiva.component';
import { ListaPonderacionComponent } from './lista-ponderacion/lista-ponderacion.component';
import { SubMenuPonderacionesComponent } from './sub-menu-ponderaciones/sub-menu-ponderaciones.component';



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
  },
  {
    path: 'opciones/catalogos/:name/formulario/:id', component: FormularioDetalleComponent
    // , canActivate: [AuthGuardEtad]
    // data: {
    //   expectedRole: 
    // }
  },
  /* rutas de ponderaciones */
  {
    path: 'opciones/sub-menu', component: SubMenuPonderacionesComponent,
    // , canActivate: [AuthGuardEtad],
    // data: {
    //   expectedRole: 
    // }
  },
  {
    path: 'opciones/sub-menu/ponderacion-carga-manual/:tipo/:id', component: PonderacionManualComponent
    // , canActivate: [AuthGuardEtad]
    // data: {
    //   expectedRole: 
    // }
  },
  {
    path: 'opciones/ponderacion-carga-masiva', component: PonderacionMasivaComponent
    // , canActivate: [AuthGuardEtad],
    // data: {
    //   expectedRole: 
    // }
  },

  {
    path: 'opciones/lista-ponderaciones', component: ListaPonderacionComponent
    // , canActivate: [AuthGuardEtad],
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
    ListByCatalogComponent,
    FormularioDetalleComponent,
    PonderacionManualComponent,
    PonderacionMasivaComponent,
    ListaPonderacionComponent,
    SubMenuPonderacionesComponent
  ],
  providers: [
    AuthGuardEtad
  ]
})
export class EtadModule { }
