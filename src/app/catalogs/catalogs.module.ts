import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule} from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { ListCatalogsComponent } from './list-catalogs/list-catalogs.component';
import { NgPipesModule } from 'ngx-pipes';
import { CatPerdidasComponent } from './cat-perdidas/cat-perdidas.component';
import { DetallePerdidasComponent } from './cat-perdidas/detalle-perdidas/detalle-perdidas.component';


const routesCatalogos: Routes = [
  { path: 'lista', component: ListCatalogsComponent },
  { path: 'perdidas', component: CatPerdidasComponent },
  { path: 'perdidas/:id', component: DetallePerdidasComponent }
];

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    NgPipesModule,
    RouterModule.forChild(routesCatalogos)
  ],
  declarations: [ListCatalogsComponent, CatPerdidasComponent, DetallePerdidasComponent]
})
export class CatalogsModule { }
