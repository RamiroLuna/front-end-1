import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { MaterializeModule } from 'angular2-materialize';
import { OptionsComponent } from './options/options.component';
import { FormularioMetasComponent } from './formulario-metas/formulario-metas.component';
import { ListaMetasComponent } from './lista-metas/lista-metas.component';

const routesMetas: Routes = [
  { path: 'opciones', component: OptionsComponent },
  { path: 'opciones/metas', component: ListaMetasComponent },
  { path: 'opciones/metas/:id', component: FormularioMetasComponent }
];

@NgModule({
  imports: [
    CommonModule,
    MaterializeModule,
    ReactiveFormsModule,
    FormsModule,
    RouterModule.forChild(routesMetas)
  ],
  declarations: [OptionsComponent, FormularioMetasComponent, ListaMetasComponent]
})
export class CuaModule { }
