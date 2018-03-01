import { Component, OnInit , AfterViewInit } from '@angular/core';
import { Catalogo } from '../../models/catalogo';
import { share } from 'rxjs/operators/share';
declare var $: any;
@Component({
  selector: 'app-list-catalogs',
  templateUrl: './list-catalogs.component.html',
  styleUrls: ['./list-catalogs.component.css']
})
export class ListCatalogsComponent implements  AfterViewInit  {
  public texto_busqueda:string = "";
  

  public catalogos: Array<Catalogo>=[
    { id : 1 , descripcion: 'Perdida' , link: '../perdidas', activo: true},
    { id : 2 , descripcion: 'Paro Planeado' , link: 'planeado', activo: true},
    { id : 3 , descripcion: 'Paro No Planeado' , link: 'no_planeado', activo: true},
    { id : 4 , descripcion: 'Reducción velocidad' , link: 'reduccion', activo: true},
    { id : 5 , descripcion: 'Calidad' , link: 'calidad', activo: true},
    { id : 6 , descripcion: 'Nombre de equipos extrusores' , link: 'extrusores', activo: true},
    { id : 7 , descripcion: 'Nombre de equipos SSP' , link: 'ssp', activo: true},
    { id : 8 , descripcion: 'Clave Equipo' , link: 'clave', activo: true},
    { id : 9 , descripcion: 'Nombre Equipo' , link: 'equipo', activo: true}
  ]

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

}
