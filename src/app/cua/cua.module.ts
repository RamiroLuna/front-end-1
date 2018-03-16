import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { MaterializeModule } from 'angular2-materialize';
import { OptionsComponent } from './options/options.component';

const routesMetas: Routes = [
  { path: 'opciones', component: OptionsComponent }
];

@NgModule({
  imports: [
    CommonModule,
    MaterializeModule,
    ReactiveFormsModule,
    FormsModule,
    RouterModule.forChild(routesMetas)
  ],
  declarations: [OptionsComponent]
})
export class CuaModule { }
