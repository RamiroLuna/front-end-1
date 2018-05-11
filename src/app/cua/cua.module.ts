import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { MaterializeModule } from 'angular2-materialize';
import { OptionsComponent } from './options/options.component';
import { MetaManualComponent } from './meta-manual/meta-manual.component';
import { ListaMetasEdicionComponent } from './lista-metas-edicion/lista-metas-edicion.component';
import { ListaFallasComponent } from './lista-fallas/lista-fallas.component';
import { FormularioFallasComponent } from './formulario-fallas/formulario-fallas.component';
import { ListCatalogsComponent } from './list-catalogs/list-catalogs.component';
import { ListByCatalogComponent } from './list-by-catalog/list-by-catalog.component';
import { FormularioDetalleComponent } from './list-by-catalog/formulario-detalle/formulario-detalle.component';
import { NgPipesModule } from 'ngx-pipes';
import { ListaReportesComponent } from './lista-reportes/lista-reportes.component';
import { RptFuentePerdidasComponent } from './rpt-fuente-perdidas/rpt-fuente-perdidas.component';
import { MetaMasivaComponent } from './meta-masiva/meta-masiva.component';
import { FormularioProduccionComponent } from './formulario-produccion/formulario-produccion.component';
import { ListaProduccionComponent } from './lista-produccion/lista-produccion.component';
import { AuthGuardCua } from '../auth/auth.guard.cua';
import { ValidaProduccionComponent } from './valida-produccion/valida-produccion.component';
import { PipeClass } from '../pipes';
import { ListaValidacionComponent } from './lista-validacion/lista-validacion.component';
import { RptDisponibilidadComponent } from './rpt-disponibilidad/rpt-disponibilidad.component';
import { RptOeeComponent } from './rpt-oee/rpt-oee.component';
import { RptResumenOeeComponent } from './rpt-resumen-oee/rpt-resumen-oee.component';


const routesMetas: Routes = [
  { path: 'opciones', component: OptionsComponent },
  {
    path: 'opciones/fallas', component: ListaFallasComponent, canActivate: [AuthGuardCua],
    data: {
      expectedRole: 7
    }
  },
  {
    path: 'opciones/fallas/:id', component: FormularioFallasComponent, canActivate: [AuthGuardCua],
    data: {
      expectedRole: 6
    }
  },
  /* rutas de metas */
  {
    path: 'opciones/metas-lista-edicion', component: ListaMetasEdicionComponent, canActivate: [AuthGuardCua],
    data: {
      expectedRole: 3
    }
  },
  {
    path: 'opciones/metas-carga-manual/:id', component: MetaManualComponent, canActivate: [AuthGuardCua],
    data: {
      expectedRole: 2
    }
  },
  {
    path: 'opciones/metas-carga-masiva', component: MetaMasivaComponent, canActivate: [AuthGuardCua],
    data: {
      expectedRole: 1
    }
  },
  /* rutas de catalogos */
  {
    path: 'opciones/catalogos', component: ListCatalogsComponent, canActivate: [AuthGuardCua],
    data: {
      expectedRole: 22
    }
  },
  {
    path: 'opciones/catalogos/:name', component: ListByCatalogComponent, canActivate: [AuthGuardCua],
    data: {
      expectedRole: 22
    }
  },
  {
    path: 'opciones/catalogos/:name/formulario/:id', component: FormularioDetalleComponent, canActivate: [AuthGuardCua],
    data: {
      expectedRole: 22
    }
  },
  /* rutas de reportes */
  { path: 'opciones/lista-reportes', component: ListaReportesComponent },
  { path: 'opciones/lista-reportes/fuente-perdidas', component: RptFuentePerdidasComponent },
  { path: 'opciones/lista-reportes/disponibilidad', component: RptDisponibilidadComponent },
  { path: 'opciones/lista-reportes/oee', component: RptOeeComponent },
  { path: 'opciones/lista-reportes/resumen-oee', component: RptResumenOeeComponent },

  /* Registro de produccion */
  {
    path: 'opciones/produccion', component: ListaProduccionComponent, canActivate: [AuthGuardCua],
    data: {
      expectedRole: 18
    }
  },
  {
    path: 'opciones/produccion/:id', component: FormularioProduccionComponent, canActivate: [AuthGuardCua],
    data: {
      expectedRole: 17
    }
  },
  /* Validacion de produccion */
  {
    path: 'opciones/validaciones', component: ListaValidacionComponent, canActivate: [AuthGuardCua],
    data: {
      expectedRole: 20
    }
  },
  {
    path: 'opciones/validaciones/:id', component: ValidaProduccionComponent, canActivate: [AuthGuardCua],
    data: {
      expectedRole: 20
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
    RouterModule.forChild(routesMetas)
  ],
  declarations: [
    OptionsComponent,
    MetaManualComponent,
    ListaMetasEdicionComponent,
    ListaFallasComponent,
    FormularioFallasComponent,
    ListCatalogsComponent,
    ListByCatalogComponent,
    FormularioDetalleComponent,
    ListaReportesComponent,
    RptFuentePerdidasComponent,
    MetaMasivaComponent,
    FormularioProduccionComponent,
    ListaProduccionComponent,
    ValidaProduccionComponent,
    PipeClass,
    ListaValidacionComponent,
    RptDisponibilidadComponent,
    RptOeeComponent,
    RptResumenOeeComponent
  ],
  providers: [
    AuthGuardCua
  ]
})
export class CuaModule { }
