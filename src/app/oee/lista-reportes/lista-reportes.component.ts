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
    { id : 1 , nombre_reporte: 'Disponibilidad' , link:'disponibilidad' , activo: true},
    { id : 2 , nombre_reporte: 'Fuente de perdidas' , link:'fuente-perdidas' , activo: true},
    { id : 3 , nombre_reporte: 'OEE' , link:'oee' , activo: true},
    { id : 4 , nombre_reporte: 'Resumen OEE' , link:'resumen-oee' , activo: true},
    { id : 5 , nombre_reporte: 'Diario de producción' , link:'diario-produccion' , activo: true},
    { id : 6 , nombre_reporte: 'Producción Real vs Plan' , link:'produccion-real-plan' , activo: true},
    { id : 7 , nombre_reporte: 'Velocidad Promedio' , link:'velocidad-promedio' , activo: true},
    { id : 8 , nombre_reporte: 'Subproductos' , link:'subproductos' , activo: true},
    { id : 9 , nombre_reporte: 'Producción Junta Jucodi' , link:'jucodi' , activo: true},
    { id : 10 , nombre_reporte: 'Fallas' , link:'detalles-fallas' , activo: true}
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
