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
    { id : 1 , nombre_reporte: 'OEE Amut 1' , link:'oee-amut-1' , activo: true},
    { id : 2 , nombre_reporte: 'OEE Amut 2' , link:'' , activo: true},
    { id : 3 , nombre_reporte: 'OEE Extrusion 1' , link:'' , activo: true},
    { id : 4 , nombre_reporte: 'OEE Extrusion 2' , link:'' , activo: true},
    { id : 5 , nombre_reporte: 'OEE PTAR' , link:'' , activo: true},
    { id : 6 , nombre_reporte: 'OEE SSP' , link:'' , activo: true},
    { id : 7 , nombre_reporte: 'Fallas por turnos' , link:'fallas' , activo: true},
    { id : 8 , nombre_reporte: 'ETAD Amut (A1 y A2)' , link:'' , activo: true},
    { id : 9 , nombre_reporte: 'ETAD Buhler (E1 y E2)' , link:'' , activo: true},
    { id : 10 , nombre_reporte: 'ETAD PTAR' , link:'' , activo: true},
    { id : 11 , nombre_reporte: 'ETAD Buhler SSP' , link:'' , activo: true},
    { id : 12 , nombre_reporte: 'Diario de Producción JUDO  Amut (A1 y A2)' , link:'judo-amut' , activo: true},
    { id : 13 , nombre_reporte: 'Diario de Producción JUDO Buhler (E1 y E2)' , link:'' , activo: true},
    { id : 14 , nombre_reporte: 'Diario de Producción JUDO PTAR' , link:'' , activo: true},
    { id : 15 , nombre_reporte: 'Diario de Producción SSP' , link:'' , activo: true},
    { id : 16 , nombre_reporte: 'OEE Anual Amut ' , link:'' , activo: true},
    { id : 17 , nombre_reporte: 'OEE Anual Buhler (E1 y E2)' , link:'' , activo: true},
    { id : 18 , nombre_reporte: 'OEE Anual PTAR' , link:'' , activo: true},
    { id : 19 , nombre_reporte: 'OEE Anual SSP' , link:'' , activo: true}
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
