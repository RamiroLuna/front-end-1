import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule} from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { ListCatalogsComponent } from './list-catalogs/list-catalogs.component';
import { NgPipesModule } from 'ngx-pipes';
import { ListByCatalogComponent } from './list-by-catalog/list-by-catalog.component';
import { FormularioDetalleComponent } from './list-by-catalog/formulario-detalle/formulario-detalle.component';


const routesCatalogos: Routes = [
  { path: 'lista', component: ListCatalogsComponent},
  { path: 'lista/:name', component: ListByCatalogComponent },
  { path: 'lista/formulario/:name/:id', component: FormularioDetalleComponent }
];

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    NgPipesModule,
    RouterModule.forChild(routesCatalogos)
  ],
  declarations: [ListCatalogsComponent, ListByCatalogComponent, FormularioDetalleComponent]
})
export class CatalogsModule { }
