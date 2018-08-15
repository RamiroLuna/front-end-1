import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { MaterializeModule } from 'angular2-materialize';
import { OptionsComponent } from './options/options.component';
import { FormularioIshikawaComponent } from './formulario-ishikawa/formulario-ishikawa.component';
import { RegistroComponent } from './registro/registro.component';

const routesIshikawa: Routes = [
  { path: 'opciones', component: OptionsComponent },
  { path: 'opciones/registro-ishikawa/:id', component: RegistroComponent },
];

@NgModule({
  imports: [
    CommonModule,
    MaterializeModule,
    ReactiveFormsModule,
    FormsModule,
    RouterModule.forChild(routesIshikawa)
  ],
  declarations: [OptionsComponent, FormularioIshikawaComponent, RegistroComponent]
})
export class IshikawaModule { }
