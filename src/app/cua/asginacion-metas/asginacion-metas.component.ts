import {
  Component, Input,
  OnInit,
  OnChanges, SimpleChanges, SimpleChange
} from '@angular/core';


@Component({
  selector: 'app-asginacion-metas',
  templateUrl: './asginacion-metas.component.html'
})
export class AsginacionMetasComponent implements OnChanges, OnInit {

  /*
   * Bloque de variables que se requieren
   */
  @Input() id_meta: number;
  @Input() metaselected: string;
  @Input() lineaselected: string;
  /*
   *Fin de variables recibidas por el componente padre
   */
  constructor() { }

  ngOnChanges(changes: SimpleChanges) {  
    const metaselected: SimpleChange = changes.metaselected;
    const lineaselected: SimpleChange = changes.lineaselected;  
  }

  ngOnInit() {

  }
}
