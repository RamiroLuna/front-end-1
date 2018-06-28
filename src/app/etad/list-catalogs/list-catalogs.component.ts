import { Component, AfterViewInit } from '@angular/core';

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
    { id: 1, name: 'pet_cat_meta_estrategica', descripcion: 'Metas Estratégicas', link: 'metas-estrategicas', activo: true },
    { id: 2, name: 'pet_cat_objetivo_operativo', descripcion: 'Objetivos Operativos', link: 'objetivos-operativos', activo: true },
    { id: 3, name: 'pet_cat_kpi_operativo', descripcion: 'KPI\'s Operativos', link: 'kpis-operativos', activo: true }
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
