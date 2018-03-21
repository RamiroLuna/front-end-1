import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { MaterializeModule } from 'angular2-materialize';
import { OptionsComponent } from './options/options.component';
import { FormularioMetasComponent } from './formulario-metas/formulario-metas.component';
import { ListaMetasComponent } from './lista-metas/lista-metas.component';
import { AsginacionMetasComponent } from './asginacion-metas/asginacion-metas.component';
import { ListaAsignacionComponent } from './lista-asignacion/lista-asignacion.component';
import { ListaFallasComponent } from './lista-fallas/lista-fallas.component';
import { FormularioFallasComponent } from './formulario-fallas/formulario-fallas.component';


const routesMetas: Routes = [
  { path: 'opciones', component: OptionsComponent },
  { path: 'opciones/metas', component: ListaMetasComponent },
  { path: 'opciones/metas/:id', component: FormularioMetasComponent },
  { path: 'opciones/metas-asignaciones', component: ListaAsignacionComponent },
  { path: 'opciones/metas-asignaciones/:id', component: AsginacionMetasComponent },
  { path: 'opciones/fallas', component: ListaFallasComponent },
  { path: 'opciones/fallas/:id', component: FormularioFallasComponent }
];

@NgModule({
  imports: [
    CommonModule,
    MaterializeModule,
    ReactiveFormsModule,
    FormsModule,
    
    RouterModule.forChild(routesMetas)
  ],
  declarations: [OptionsComponent, FormularioMetasComponent, ListaMetasComponent, AsginacionMetasComponent, ListaAsignacionComponent, ListaFallasComponent, FormularioFallasComponent]
})
export class CuaModule { }
