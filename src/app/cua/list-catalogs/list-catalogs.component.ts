import { Component, OnInit , AfterViewInit } from '@angular/core';
import { share } from 'rxjs/operators/share';
declare var $: any;
@Component({
  selector: 'app-list-catalogs',
  templateUrl: './list-catalogs.component.html',
  styleUrls: ['./list-catalogs.component.css']
})
export class ListCatalogsComponent implements  AfterViewInit  {
  public texto_busqueda:string = "";
  
  /*
   * En este arreglo se deben agregar los nuevos catalogos tanto especificos como genericos
   */ 
  public catalogos: Array<any>=[
    /*
     * Catalogos genericos
     */ 
    { id : 1 , name:'pet_cat_perdida', descripcion: 'Perdida' , link: 'perdidas', activo: true},
    { id : 2 , name:'pet_cat_planeado', descripcion: 'Paro Planeado' , link: 'planeado', activo: true},
    { id : 3 , name:'pet_cat_noplaneado', descripcion: 'Paro No Planeado' , link: 'no_planeado', activo: true},
    { id : 4 , name:'pet_cat_reduc_velocidad', descripcion: 'Reducción velocidad' , link: 'reduccion', activo: true},
    { id : 5 , name:'pet_cat_calidad', descripcion: 'Calidad' , link: 'calidad', activo: true},
    { id : 6 , name:'pet_cat_equipos_extrusores_bulher', descripcion: 'Equipos extrusores' , link: 'extrusores', activo: true},
    { id : 7 , name:'pet_cat_equipos_ssp', descripcion: 'Equipos SSP' , link: 'ssp', activo: true},
    { id : 8 , name:'pet_cat_gpo_linea', descripcion: 'Grupos de linea' , link: 'grupo-linea', activo: true},
    { id : 9 , name:'pet_cat_grupos', descripcion: 'Grupos' , link: 'grupos', activo: true},
    { id : 10 , name:'pet_cat_perfiles', descripcion: 'Perfiles' , link: 'perfiles', activo: true},
    { id : 11 , name:'pet_cat_turnos', descripcion: 'Turnos' , link: 'turnos', activo: true},

    /* Falta programar */
    { id : 14 , name:'pet_cat_equipo_ptar', descripcion: 'Equipos PTAR' , link: 'equipos_ptar', activo: true},
    { id : 15 , name:'pet_cat_paro_por_calidad', descripcion: 'Paro por calidad' , link: 'paro_calidad', activo: true},
    { id : 16 , name:'pet_cat_productos', descripcion: 'Productos' , link: 'productos', activo: true},
    { id : 17 , name:'pet_cat_unidad_medida', descripcion: 'Unidad de medida' , link: 'unidad_medida', activo: true},
    /* Fin falta programar*/

    /*
     * Catalogos especificos
     */ 
    { id : 12 , name:'pet_cat_lineas', descripcion: 'Lineas' , link: 'lineas', activo: true},
    { id : 13 , name:'pet_cat_nombre_equipo_amut', descripcion: 'Equipo AMUT' , link: 'equipos_amut', activo: true},
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
