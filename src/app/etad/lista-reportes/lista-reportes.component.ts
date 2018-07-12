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
    { id : 1 , nombre_reporte: 'Reporte global por área' , link:'reporte-global-area' , activo: true}
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
