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
import { SubMenuIndicadoresComponent } from './sub-menu-indicadores/sub-menu-indicadores.component';
import { FormularioIndicadorDayComponent } from './formulario-indicador-day/formulario-indicador-day.component';
import { ListaIndicadorDayComponent } from './lista-indicador-day/lista-indicador-day.component';



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
    path: 'opciones/:seccion/sub-menu', component: SubMenuPonderacionesComponent,
    // , canActivate: [AuthGuardEtad],
    // data: {
    //   expectedRole: 
    // }
  },
  {
    path: 'opciones/:seccion/sub-menu/:tipo/:id', component: PonderacionManualComponent
    // , canActivate: [AuthGuardEtad]
    // data: {
    //   expectedRole: 
    // }
  },
  {
    path: 'opciones/:seccion/sub-menu/:tipo', component: ListaPonderacionComponent
    // , canActivate: [AuthGuardEtad],
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
  /* rutas registro de indicadores */
  {
    path: 'opciones/:seccion/sub-menu-indicadores', component: SubMenuIndicadoresComponent,
    // , canActivate: [AuthGuardEtad],
    // data: {
    //   expectedRole: 
    // }
  },
  {
    path: 'opciones/:seccion/sub-menu-indicadores/diarios', component: ListaIndicadorDayComponent,
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
    SubMenuPonderacionesComponent,
    SubMenuIndicadoresComponent,
    FormularioIndicadorDayComponent,
    ListaIndicadorDayComponent
  ],
  providers: [
    AuthGuardEtad
  ]
})
export class EtadModule { }
