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
import { FormatNumberPipeClass } from '../pipes/format.number.pipe';
import { ToneladasPipeClass } from '../pipes/toneladas.pipe';
import { SeparatorPipeClass } from '../pipes/separator.pipe';
import { ListaValidacionComponent } from './lista-validacion/lista-validacion.component';
import { RptDisponibilidadComponent } from './rpt-disponibilidad/rpt-disponibilidad.component';
import { RptOeeComponent } from './rpt-oee/rpt-oee.component';
import { RptResumenOeeComponent } from './rpt-resumen-oee/rpt-resumen-oee.component';
import { FormularioPeriodoComponent } from './formulario-periodo/formulario-periodo.component';
import { ListaPeriodosComponent } from './lista-periodos/lista-periodos.component';
import { RptDiarioProduccionComponent } from './rpt-diario-produccion/rpt-diario-produccion.component';
import { RptJucodiComponent } from './rpt-jucodi/rpt-jucodi.component';
import { RptVelocidadPromedioComponent } from './rpt-velocidad-promedio/rpt-velocidad-promedio.component';
import { RptSubproductosComponent } from './rpt-subproductos/rpt-subproductos.component';
import { RptProduccionRealPlanComponent } from './rpt-produccion-real-plan/rpt-produccion-real-plan.component';



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
      expectedRole: 4
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
  /* rutas de periodos */
  {
    path: 'opciones/periodo', component: FormularioPeriodoComponent, canActivate: [AuthGuardCua],
    data: {
      expectedRole: 23
    }
  },
  {
    path: 'opciones/lista-periodos', component: ListaPeriodosComponent, canActivate: [AuthGuardCua],
    data: {
      expectedRole: 25
    }
  },

  /* rutas de reportes */
  { path: 'opciones/lista-reportes', component: ListaReportesComponent },
  { path: 'opciones/lista-reportes/fuente-perdidas', component: RptFuentePerdidasComponent },
  { path: 'opciones/lista-reportes/disponibilidad', component: RptDisponibilidadComponent },
  { path: 'opciones/lista-reportes/oee', component: RptOeeComponent },
  { path: 'opciones/lista-reportes/resumen-oee', component: RptResumenOeeComponent },
  { path: 'opciones/lista-reportes/diario-produccion', component: RptDiarioProduccionComponent },
  { path: 'opciones/lista-reportes/jucodi', component: RptJucodiComponent },
  { path: 'opciones/lista-reportes/velocidad-promedio', component: RptVelocidadPromedioComponent },
  { path: 'opciones/lista-reportes/subproductos', component: RptSubproductosComponent },
  { path: 'opciones/lista-reportes/produccion-real-plan', component: RptProduccionRealPlanComponent },
  
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
    ListaValidacionComponent,
    RptDisponibilidadComponent,
    RptOeeComponent,
    RptResumenOeeComponent,
    FormularioPeriodoComponent,
    ListaPeriodosComponent,
    RptDiarioProduccionComponent,
    RptJucodiComponent,
    FormatNumberPipeClass,
    SeparatorPipeClass,
    ToneladasPipeClass,
    RptVelocidadPromedioComponent,
    RptSubproductosComponent,
    RptProduccionRealPlanComponent
  ],
  providers: [
    AuthGuardCua
  ]
})
export class CuaModule { }
