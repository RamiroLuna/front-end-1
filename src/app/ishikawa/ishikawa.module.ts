import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { MaterializeModule } from 'angular2-materialize';
import { OptionsComponent } from './options/options.component';
import { FormularioIshikawaComponent } from './formulario-ishikawa/formulario-ishikawa.component';

const routesIshikawa: Routes = [
  { path: 'opciones', component: OptionsComponent },
  { path: 'opciones/formulario-ishikawa/:id', component: FormularioIshikawaComponent },
];

@NgModule({
  imports: [
    CommonModule,
    MaterializeModule,
    ReactiveFormsModule,
    FormsModule,
    RouterModule.forChild(routesIshikawa)
  ],
  declarations: [OptionsComponent, FormularioIshikawaComponent]
})
export class IshikawaModule { }
