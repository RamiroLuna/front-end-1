import { Directive, Component, OnInit, AfterViewInit,  OnChanges } from '@angular/core';
import { Meta } from '../../models/meta';
import {
  trigger,
  state,
  style,
  animate,
  transition
} from '@angular/animations';
declare var $: any;
declare var Materialize: any;
@Component({
  selector: 'app-lista-metas',
  templateUrl: './lista-metas.component.html',
  animations: [
    trigger('visibility', [
      state('inactive', style({
        opacity: 0,
        display: 'none'
      })),
      state('active',   style({
        opacity: 1,
        display: 'block',
      })),
      transition('inactive => active', animate('100ms ease-in')),
      transition('active => inactive', animate('100ms ease-out'))
    ])
  ]
})
export class ListaMetasComponent implements OnInit{
  public loading: boolean;
  public status: string = 'inactive';
  public status_tabla: string = 'active';
  /*
   * Variable utilizadas por el componente asignacion de metas
   */
  public id_meta: number;
  public metaselected: string;
  public lineaselected: string;

  /*
   *Fin de variables para pasar al componente hijo
   */ 

  public metas: Array<Meta> = [{
    id_meta: 1,
    id_linea: 1,
    descripcion_linea: 'decripcion linea 1',
    meta: 'meta uno 1',
    tipo_medida: 'kilogramos',
    posicion: 1,
    activo: 1,
    /*
     *
     */
    dia: '20/03/2018',
    turno: 'Turno 1',
    grupo: 'grupo 2',
    valor: 100
  },
  {
    id_meta: 2,
    id_linea: 2,
    descripcion_linea: 'decripcion linea 2',
    meta: 'meta uno 2',
    tipo_medida: 'kilogramos 2',
    posicion: 2,
    activo: 1,
    /*
     *
     */
    dia: '20/03/2012',
    turno: 'Turno 12',
    grupo: 'grupo 22',
    valor: 100
  },
];


  


  constructor() { }

  ngOnInit() {
    this.loading = true;
    this.loading = false;
  }


  changeVisibility(meta:Meta) {
    event.preventDefault();

    /*
     * Update variable para mostrar
     */ 
    this.id_meta = meta.id_meta;
    this.metaselected = meta.meta;
    this.lineaselected = meta.descripcion_linea;
    /*
     * Fin de bloque
     */ 
    this.status = this.status === 'inactive' ? 'active' : 'inactive';
    this.status_tabla = this.status_tabla === 'inactive' ? 'active' : 'inactive';
  }

  verMetas(){
    this.status = this.status === 'inactive' ? 'active' : 'inactive';
    this.status_tabla = this.status_tabla === 'inactive' ? 'active' : 'inactive';
  }
}
