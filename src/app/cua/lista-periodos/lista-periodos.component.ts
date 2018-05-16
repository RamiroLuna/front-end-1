import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../auth/auth.service';
import { Meta } from '../../models/meta';
import swal from 'sweetalert2';
import { ListaPeriodosService } from './lista-periodos.service';
import { Periodo } from '../../models/periodo';
import { Linea } from '../../models/linea';
import { Catalogo } from '../../models/catalogo';
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
  selector: 'app-lista-periodos',
  templateUrl: './lista-periodos.component.html',
  styleUrls: ['./lista-periodos.component.css'],
  providers: [ListaPeriodosService],
  animations: [
    trigger('visibility', [
      state('inactive', style({
        opacity: 0
      })),
      state('active', style({
        opacity: 1
      })),
      transition('inactive => active', animate('1s ease-in')),
      transition('active => inactive', animate('500ms ease-out'))
    ])
  ]
})
export class ListaPeriodosComponent implements OnInit {

  public loading: boolean;
  public datos_tabla: boolean;
  public mensajeModal: string;
  public disabled: boolean;

  public periodos: Array<Periodo>;
  public lineas: Array<Linea>;
  public status: string;
  public texto_busqueda: string = "";

  constructor(private auth: AuthService,
    private service: ListaPeriodosService) { }

  ngOnInit() {
    this.loading = true;
    this.datos_tabla = false;
    this.disabled = false;
    this.periodos = [];
    this.lineas = [];
    this.status = 'inactive';

    this.service.getInit(this.auth.getIdUsuario()).subscribe(result => {
      console.log('getPeriodos', result)
      if (result.response.sucessfull) {
        this.lineas = result.data.listLineas || [];
        this.periodos = result.data.listPeriodos || [];
        this.datos_tabla = true;
        this.loading = false;
        setTimeout(() => { this.ngAfterViewInitHttp() }, 200)
      } else {
        Materialize.toast('Ocurrió  un error al consultar catalogos!', 4000, 'red');
        this.loading = false;
      }
    }, error => {
      Materialize.toast('Ocurrió  un error en el servicio!', 4000, 'red');
      this.loading = false;
    });
  }

  /*
* Carga plugins despues de cargar y mostrar objetos en el DOM
*/
  ngAfterViewInitHttp(): void {
    this.status = 'active';
    $('.tooltipped').tooltip({ delay: 50 });
  }

  regresar() {
    $('.tooltipped').tooltip('hide');
  }

  openModalConfirmacion(periodo: Periodo, accion: string, event?: any): void {
    this.mensajeModal = '';

    switch (accion) {
      case 'apertura':      
        periodo.estatus = !event.target.checked ? 1 : 0;
        this.mensajeModal = '¿Está seguro de ' + (!event.target.checked ? ' cerrar ' : ' abrir ') + ' el periodo ? ';
        break;
    }



    /* 
     * Configuración del modal de confirmación
     */
    swal({
      title: '<span style="color: #303f9f ">' + this.mensajeModal + '</span>',
      type: 'question',
      html: '<p style="color: #303f9f "> Periodo : <b>' + periodo.anio + '  ' + periodo.descripcion_mes + ' </b></p>',
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
          case 'apertura':
            if (periodo.estatus == 0) {
           
              this.service.reOpenPeriodo(this.auth.getIdUsuario(), periodo.id_periodo).subscribe(result => {
                if (result.response.sucessfull) {
                  Materialize.toast('Periodo abierto correctamente', 4000, 'green');
                } else {
                  Materialize.toast(result.response.message, 4000, 'red');
                  periodo.estatus = !periodo.estatus ? 1 : 0;
                }
              }, error => {
                periodo.estatus = !periodo.estatus ? 1 : 0;
                Materialize.toast('Ocurrió  un error en el servicio!', 4000, 'red');
              });

            } else if(periodo.estatus == 1){
           
              this.service.closePeriodo(this.auth.getIdUsuario(), periodo.id_periodo).subscribe(result => {
                if (result.response.sucessfull) {
                  Materialize.toast('Periodo cerrado correctamente', 4000, 'green');
                } else {
                  Materialize.toast(result.response.message, 4000, 'red');
                  periodo.estatus = !periodo.estatus ? 1 : 0;
                }
              }, error => {
                periodo.estatus = !periodo.estatus ? 1 : 0;
                Materialize.toast('Ocurrió  un error en el servicio!', 4000, 'red');
              });

            }

            break;
        }
        /*
        * Si cancela accion
        */
      } else if (result.dismiss === swal.DismissReason.cancel) {
        switch (accion) {
          case 'apertura':
            periodo.estatus = !periodo.estatus ? 1 : 0;
            event.target.checked = !event.target.checked;
            break;
        }

      }
    })

  }

  limpiarInput() {
    this.texto_busqueda = "";
  }

}
