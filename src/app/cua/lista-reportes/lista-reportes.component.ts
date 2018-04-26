import { Component , AfterViewInit} from '@angular/core';
declare var $: any;
@Component({
  selector: 'app-lista-reportes',
  templateUrl: './lista-reportes.component.html',
  styleUrls: ['./lista-reportes.component.css']
})
export class ListaReportesComponent implements  AfterViewInit {

  public texto_busqueda:string = "";
  
  /*
   * En este arreglo se deben agregar los reportes para el modulo de CUA
   */ 
  public reportes: Array<any>=[
    { id : 1 , nombre_reporte: 'OEE Fallas Por Linea' , link:'oee-fallas' , activo: true},
    { id : 2 , nombre_reporte: 'Fallas por turnos' , link:'fallas' , activo: true},
    { id : 3 , nombre_reporte: 'ETAD' , link:'etad' , activo: true},
    { id : 4 , nombre_reporte: 'Diario de Producción JUDO' , link:'judo' , activo: true},
    { id : 5 , nombre_reporte: 'OEE Anual Amut ' , link:'' , activo: true},
    { id : 6 , nombre_reporte: 'OEE Anual Buhler (E1 y E2)' , link:'' , activo: true},
    { id : 7 , nombre_reporte: 'OEE Anual PTAR' , link:'' , activo: true},
    { id : 8 , nombre_reporte: 'OEE Anual SSP' , link:'' , activo: true}
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
