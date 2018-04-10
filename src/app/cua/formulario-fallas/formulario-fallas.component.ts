import { Component, OnInit } from '@angular/core';

declare var $: any;
declare var Materialize: any;
@Component({
  selector: 'app-formulario-fallas',
  templateUrl: './formulario-fallas.component.html'
})
export class FormularioFallasComponent implements OnInit {

  constructor() { }

  ngOnInit() {
    setTimeout(()=>{this.ngAfterViewHttp()},200)
  }

  /*
   * Carga plugins despues de cargar y mostrar objetos en el DOM
   */
  ngAfterViewHttp(): void {
    $('textarea#problema').characterCounter();
    $('.tooltipped').tooltip({ delay: 50 });
  } 

  agregar() {
    $('.tooltipped').tooltip('hide');
  }

  regresar() {
    $('.tooltipped').tooltip('hide');
  }


}
