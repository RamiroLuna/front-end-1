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
    { id : 3 , nombre_reporte: 'Indicadores clave de desempeño ( Gráfica )', link:'reporte-indicadores-graficas' ,  activo: true},
    { id : 4 , nombre_reporte: 'Enlace objetivos estratégicos y KIP´s operativos', link:'reporte-enlace-obj-kpi' ,  activo: true},
    { id : 5 , nombre_reporte: 'Reporte de bonos', link:'reporte-bonos' ,  activo: true},
    { id : 6 , nombre_reporte: 'Reporte detallado de bonos', link:'reporte-detalle-bonos' ,  activo: true},
    { id : 7 , nombre_reporte: 'Posición Trimestral', link:'reporte-posicion-trimestral' ,  activo: true}
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
