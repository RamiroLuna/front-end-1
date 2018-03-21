import { Component, OnInit, AfterViewInit } from '@angular/core';

declare var $: any;
declare var Materialize: any;
@Component({
  selector: 'app-formulario-fallas',
  templateUrl: './formulario-fallas.component.html'
})
export class FormularioFallasComponent implements OnInit, AfterViewInit {

  constructor() { }

  ngOnInit() {
  }

  /*
   * Carga plugins de los componentes
   */ 
  ngAfterViewInit(){
    $('textarea#problema').characterCounter();
  }

}
