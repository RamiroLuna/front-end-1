import { Component , AfterViewInit} from '@angular/core';
declare var $: any;
@Component({
  selector: 'app-lista-reportes',
  templateUrl: './lista-reportes.component.html',
  styleUrls: ['./lista-reportes.component.css']
})
export class ListaReportesComponent  implements  AfterViewInit  {

  public texto_busqueda:string = "";
  
  /*
   * En este arreglo se deben agregar los reportes para el modulo de OEE
   */ 
  public reportes: Array<any>=[
    { id : 1 , nombre_reporte: 'Reporte global por área' , link:'reporte-global-area' , activo: true},
    { id : 2 , nombre_reporte: 'Indicadores clave de desempeño ( Reportes )' , link:'reporte-indicadores-kpi' , activo: true},
    { id : 3 , nombre_reporte: 'Indicadores clave de desempeño ( Graficas )', link:'reporte-indicadores-graficas' ,  activo: true}
  ];

  constructor() { }

  ngAfterViewInit() {
    
    $('.tooltipped').tooltip({delay: 50});
    $('.collapsible').collapsible();
  }

  ocultarTooltip() {
    $('.tooltipped').tooltip('hide');
  }



  limpiarInput(){
    this.texto_busqueda="";
  }

  regresar() {
    $('.tooltipped').tooltip('hide');
  }

}
