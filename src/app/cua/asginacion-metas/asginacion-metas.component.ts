import {
  Component, Input,
  OnInit,
  OnChanges, SimpleChanges, SimpleChange,
  EventEmitter,
  Output
} from '@angular/core';


@Component({
  selector: 'app-asginacion-metas',
  templateUrl: './asginacion-metas.component.html'
})
export class AsginacionMetasComponent implements OnChanges {

  /*
   * Bloque de variables que se requieren
   */
  @Input() id_meta: number;
  @Input() metaselected: string;
  @Input() lineaselected: string;
  /*
   *Fin de variables recibidas por el componente padre
   */

   /*
    * Variable para lanzar al padre
    */ 
   @Output() cancel = new EventEmitter();
    /*
     * Fin de variable para cancelar y cerrar el componente
     */

  constructor() { }

  ngOnChanges(changes: SimpleChanges) {  
    const metaselected: SimpleChange = changes.metaselected;
    const lineaselected: SimpleChange = changes.lineaselected;  
  }

  ngOnInit() {

  }

  cancelar(event):void{
    event.preventDefault();
    /*
     * Emite la accion al padre
     */ 
    this.cancel.emit();
  }
}
