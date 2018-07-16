import { Component, AfterViewInit } from '@angular/core';
declare var $: any;
@Component({
  selector: 'app-lista-configuracion-reporte',
  templateUrl: './lista-configuracion-reporte.component.html',
  styleUrls: ['lista-configuracion-reporte.css']
})
export class ListaConfiguracionReporteComponent implements AfterViewInit {

  public texto_busqueda: string = "";

  /*
   * En este arreglo se deben agregar los reportes para el modulo de OEE
   */
  public reportes: Array<any> = [
    { id: 1, nombre_reporte: 'Enlace objetivos estratégicos y KIP´s operativos', link: 'conf-rpt-obj-kpi', activo: true }
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
