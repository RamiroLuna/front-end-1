import { Component, OnInit } from '@angular/core';
import { DataTable } from '../../utils';

declare var $: any;
declare var Materialize: any;
@Component({
  selector: 'app-lista-fallas',
  templateUrl: './lista-fallas.component.html'
})
export class ListaFallasComponent implements OnInit {

  public fallas:Array<any> = [
    {  id:1, dia:'10/04/2018', grupo:'A', turno:'1', fuente:'Paro planeado', razon:'Mtto. planeado', equipo:'Molido humedo' },
    {  id:2, dia:'10/04/2018', grupo:'B', turno:'1', fuente:'Paro planeado', razon:'Mtto. planeado', equipo:'Molido humedo' },
    {  id:3, dia:'11/04/2018', grupo:'A', turno:'1', fuente:'Paro planeado', razon:'Mtto. planeado', equipo:'Molido humedo' },
    {  id:4, dia:'11/04/2018', grupo:'B', turno:'1', fuente:'Paro planeado', razon:'Mtto. planeado', equipo:'Molido humedo' },
    {  id:5, dia:'11/04/2018', grupo:'C', turno:'1', fuente:'Paro planeado', razon:'Mtto. planeado', equipo:'Molido humedo' }
  ];

  constructor() { }

  ngOnInit() {
    setTimeout(() => {this.ngAfterViewHttp();},200)
  }

    /*
   * Carga plugins despues de cargar y mostrar objetos en el DOM
   */
  ngAfterViewHttp(): void{

    DataTable('#tabla');

    $('.tooltipped').tooltip({ delay: 50 });
   } 




  agregar() {
    $('.tooltipped').tooltip('hide');
  }

  regresar() {
    $('.tooltipped').tooltip('hide');
  }
  

}
