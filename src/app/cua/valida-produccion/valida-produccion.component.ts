import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

declare var $: any;
declare var Materialize: any;

@Component({
  selector: 'app-valida-produccion',
  templateUrl: './valida-produccion.component.html',
  styleUrls: ['./valida-produccion.component.css']
})
export class ValidaProduccionComponent implements OnInit {
  
  @Input() idMeta: number;
  @Input() seccion: string;
  @Output() accion = new EventEmitter();
  
  constructor() { }

  ngOnInit() {
    console.log('id de la meta seleccionada',this.idMeta)
  }

  regresar() {
    $('.tooltipped').tooltip('hide');
    this.accion.emit();
  }

}
