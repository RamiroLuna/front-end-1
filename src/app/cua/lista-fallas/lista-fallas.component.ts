import { Component, OnInit } from '@angular/core';

declare var $: any;
declare var Materialize: any;
@Component({
  selector: 'app-lista-fallas',
  templateUrl: './lista-fallas.component.html'
})
export class ListaFallasComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  
  ngAfterViewInit(): void {
    $('.tooltipped').tooltip({ delay: 50 });
  }

  agregar() {
    $('.tooltipped').tooltip('hide');
  }

  regresar() {
    $('.tooltipped').tooltip('hide');
  }

}
