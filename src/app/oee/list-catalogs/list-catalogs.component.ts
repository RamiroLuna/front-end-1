import { Component, OnInit, AfterViewInit } from '@angular/core';
import { share } from 'rxjs/operators/share';
declare var $: any;
@Component({
  selector: 'app-list-catalogs',
  templateUrl: './list-catalogs.component.html',
  styleUrls: ['./list-catalogs.component.css']
})
export class ListCatalogsComponent implements AfterViewInit {
  public texto_busqueda: string = "";


  /*
   * En este arreglo se deben agregar los nuevos catalogos tanto especificos como genericos
   */
  public catalogos: Array<any> = [
    { id: 1, name: 'pet_cat_fuentes_paro', descripcion: 'Fuentes de Paro', link: 'fuentes', activo: true },
    { id: 2, name: 'pet_cat_razon_paro', descripcion: 'Razon de paro', link: 'razones', activo: true },
    { id: 3, name: 'pet_cat_equipos', descripcion: 'Equipos', link: 'equipos', activo: true },
    { id: 4, name: 'pet_cat_producto', descripcion: 'Productos', link: 'productos', activo: true },
    { id: 5, name: 'pet_cat_tipo_producto', descripcion: 'Tipo producto', link: 'tipo_productos', activo: true }
  ];


  constructor() { }

  ngAfterViewInit() {

    $('.tooltipped').tooltip({ delay: 50 });
    $('.collapsible').collapsible();
  }

  ocultarTooltip() {
    $('.tooltipped').tooltip('hide');
  }



  limpiarInput() {
    this.texto_busqueda = "";
  }

  regresar() {
    $('.tooltipped').tooltip('hide');
  }

}
