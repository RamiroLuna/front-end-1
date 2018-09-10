import { Component, AfterViewInit } from '@angular/core';

declare var $: any;
@Component({
  selector: 'app-catalogos-generales',
  templateUrl: './catalogos-generales.component.html',
  styles: []
})
export class CatalogosGeneralesComponent implements AfterViewInit {

  /*
   * En este arreglo se deben agregar los nuevos catalogos tanto especificos como genericos
   */
  public catalogos: Array<any> = [
    { id: 1, name: 'pet_cat_gpo_linea', descripcion: ' Áreas para OEE', link: 'gpos-lineas', activo: true },
    { id: 2, name: 'pet_cat_etad', descripcion: 'ETAD\'s', link: 'etad-kpis', activo: true },
    { id: 3, name: 'pet_cat_linea', descripcion: 'Línea', link: 'lineas', activo: true }
  ];


  constructor() { }

  ngAfterViewInit() {

    $('.tooltipped').tooltip({ delay: 50 });
    $('.collapsible').collapsible();
  }

  ocultarTooltip() {
    $('.tooltipped').tooltip('hide');
  }

  regresar() {
    $('.tooltipped').tooltip('hide');
  }

}
