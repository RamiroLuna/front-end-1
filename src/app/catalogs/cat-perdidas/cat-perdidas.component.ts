import { Component, OnInit , AfterViewInit} from '@angular/core';
declare var $: any;
@Component({
  selector: 'app-cat-perdidas',
  templateUrl: './cat-perdidas.component.html',
  styles: []
})
export class CatPerdidasComponent implements OnInit, AfterViewInit{

  public equipos:any[]=[
    { id : 1 , nombre: 'Catalogo equipo 1' , bloqueado: false},
    { id : 2 , nombre: 'Catalogo equipo 2' , bloqueado: false},
    { id : 3 , nombre: 'Catalogo equipo 3' , bloqueado: false},
    { id : 4 , nombre: 'Catalogo equipo 4' , bloqueado: false},
    { id : 5 , nombre: 'Catalogo equipo 5' , bloqueado: false},
    { id : 6 , nombre: 'Catalogo equipo 6' , bloqueado: false},
    { id : 7 , nombre: 'Catalogo equipo 7' , bloqueado: false},
    { id : 8 , nombre: 'Catalogo equipo 8' , bloqueado: false}
  ]

  constructor() { }

  ngOnInit() {}

  ngAfterViewInit() {
    $('.tooltipped').tooltip({delay: 50});
  }

  agregar(){
    $('.tooltipped').tooltip('hide');
  }

  regresar(){
    $('.tooltipped').tooltip('hide');
  }

}
