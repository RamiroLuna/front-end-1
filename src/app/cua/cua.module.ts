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
import { RptOeeFallasComponent } from './rpt-oee-fallas/rpt-oee-fallas.component';
import { RptJudoComponent } from './rpt-judo/rpt-judo.component';
import { RptFallasComponent } from './rpt-fallas/rpt-fallas.component';
import { MetaMasivaComponent } from './meta-masiva/meta-masiva.component';
import { FormularioProduccionComponent } from './formulario-produccion/formulario-produccion.component';
import { ListaProduccionComponent } from './lista-produccion/lista-produccion.component';
import { RptEtadComponent } from './rpt-etad/rpt-etad.component';
import { AuthGuardCua } from '../auth/auth.guard.cua';
import { ValidaProduccionComponent } from './valida-produccion/valida-produccion.component';
import { PipeClass } from '../pipes';
import { ListaValidacionComponent } from './lista-validacion/lista-validacion.component';


const routesMetas: Routes = [
  { path: 'opciones', component: OptionsComponent },
  { path: 'opciones/fallas', component: ListaFallasComponent },
  { path: 'opciones/fallas/:id', component: FormularioFallasComponent },
  /* rutas de metas */
  {
    path: 'opciones/metas-lista-edicion', component: ListaMetasEdicionComponent, canActivate: [AuthGuardCua],
    data: {
      expectedRole: 3
    }
  },
  { path: 'opciones/metas-carga-manual/:id', component: MetaManualComponent },
  { path: 'opciones/metas-carga-masiva', component: MetaMasivaComponent },
  /* rutas de catalogos */
  { path: 'opciones/catalogos', component: ListCatalogsComponent },
  { path: 'opciones/catalogos/:name', component: ListByCatalogComponent },
  { path: 'opciones/catalogos/:name/formulario/:id', component: FormularioDetalleComponent },
  /* rutas de reportes */
  { path: 'opciones/lista-reportes', component: ListaReportesComponent },
  { path: 'opciones/lista-reportes/oee-fallas', component: RptOeeFallasComponent },
  { path: 'opciones/lista-reportes/judo', component: RptJudoComponent },
  { path: 'opciones/lista-reportes/fallas', component: RptFallasComponent },
  { path: 'opciones/lista-reportes/etad', component: RptEtadComponent },

  /* Registro de produccion */
  { path: 'opciones/produccion', component: ListaProduccionComponent },
  {
    path: 'opciones/produccion/:id', component: FormularioProduccionComponent, canActivate: [AuthGuardCua],
    data: {
      expectedRole: 17
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
    RptOeeFallasComponent,
    RptJudoComponent,
    RptFallasComponent,
    MetaMasivaComponent,
    FormularioProduccionComponent,
    ListaProduccionComponent,
    RptEtadComponent,
    ValidaProduccionComponent,
    PipeClass,
    ListaValidacionComponent
  ],
  providers: [
    AuthGuardCua
  ]
})
export class CuaModule { }
