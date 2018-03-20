import { Directive, Component, OnInit, AfterViewInit,  OnChanges } from '@angular/core';
import { Meta } from '../../models/meta';
import { deleteItemArray } from '../../utils';
import swal from 'sweetalert2';
import {
  trigger,
  state,
  style,
  animate,
  transition
} from '@angular/animations';
import { AuthService } from '../../auth/auth.service';
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
      transition('inactive => active', animate('200ms ease-in')),
      transition('active => inactive', animate('200ms ease-out'))
    ])
  ]
})
export class ListaMetasComponent implements OnInit{
  public loading: boolean;
  public status: string = 'inactive';
  public status_tabla: string = 'active';
  public mensajeModal: string;
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


  


  constructor(private auth: AuthService) { }

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

  /*
   * 
   */ 
  openModalConfirmacion(meta: Meta, accion: string, event?: any): void {
    this.mensajeModal = '';

    switch (accion) {
      case 'activar':
        meta.activo = event.target.checked ? 1 : 0;
        this.mensajeModal = '¿Está seguro de ' + (event.target.checked ? ' activar ' : ' desactivar ') + ' ? ';
        break;
      case 'eliminar':
        this.mensajeModal = '¿Está seguro de eliminar? ';
        break;
    }


    /* 
     * Configuración del modal de confirmación
     */
    swal({
      title: '<span style="color: #303f9f ">' + this.mensajeModal + '</span>',
      type: 'question',
      html: '<p style="color: #303f9f "> meta: <b>' + meta.meta + ' </b></p>',
      showCancelButton: true,
      confirmButtonColor: '#303f9f',
      cancelButtonColor: '#9fa8da ',
      cancelButtonText: 'Cancelar',
      confirmButtonText: 'Si!',
      allowOutsideClick: false,
      allowEnterKey: false
    }).then((result) => {
      /*
       * Si acepta
       */
      if (result.value) {
        switch (accion) {
          case 'activar':
           /* this.service.update(this.auth.getIdUsuario(), meta).subscribe(result => {
              if (result.response.sucessfull) {
                Materialize.toast('Actualización completa', 4000, 'green');

              } else {
                Materialize.toast(result.response.message, 4000, 'red');
                meta.activo = !meta.activo?1:0;
              }
            }, error => {
              meta.activo = !meta.activo?1:0;
              Materialize.toast('Ocurrió  un error en el servicio!', 4000, 'red');
            });*/
            alert('activar')
            break;
          case 'eliminar':
          alert('eliminar')
            /*this.service.delete(this.auth.getIdUsuario(), meta.id_meta).subscribe(result => {
              if (result.response.sucessfull) {
                deleteItemArray(this.metas, meta.id_meta, 'id_usuario');
                Materialize.toast('Se eliminó correctamente ', 4000, 'green');
              } else {
                Materialize.toast(result.response.message, 4000, 'red');
              }
            }, error => {
              Materialize.toast('Ocurrió  un error en el servicio!', 4000, 'red');
            });*/
            break;
        } 
        /*
        * Si cancela accion
        */
      } else if (result.dismiss === swal.DismissReason.cancel) {
        switch (accion) {
          case 'activar':
            meta.activo = !meta.activo ? 1 : 0;
            event.target.checked = !event.target.checked;
            break;
        }

      }
    })

  }
}
