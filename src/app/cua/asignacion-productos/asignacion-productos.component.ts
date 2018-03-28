import { Component, OnInit, Input, SimpleChanges, SimpleChange, Output, EventEmitter } from '@angular/core';
import { MetaAsignacion } from '../../models/meta-asignacion';

@Component({
  selector: 'app-asignacion-productos',
  templateUrl: './asignacion-productos.component.html'
})
export class AsignacionProductosComponent implements OnInit {

  /*
   * Bloque de variables que se requieren
   */
  @Input() asignacion_seleccionada: MetaAsignacion;
  /*
   *Fin de variables recibidas por el componente padre
   */

  /*
   * Bloque de variables que se enviarán al padre
   */
  @Output() cancelar = new EventEmitter();
  /*
   * Fin de bloque
   */ 

  constructor() { }

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges) {  
      const asignacion_seleccionada: SimpleChange = changes.asignacion_seleccionada;

      console.log('asignacion_seleccionada',asignacion_seleccionada)
  }

  regresarLista(event):void{
    this.cancelar.emit();
  }

}
