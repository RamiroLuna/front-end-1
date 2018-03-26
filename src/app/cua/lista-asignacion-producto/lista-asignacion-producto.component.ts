import { Component, OnInit, AfterViewInit } from '@angular/core';
import { AuthService } from '../../auth/auth.service';
import { ProductoAsignacion } from '../../models/producto-asignacion';
import { ListaAsignacionProductoService } from './lista-asignacion-producto.service';
import { deleteItemArray , getAnioActual} from '../../utils';
import swal from 'sweetalert2';

declare var $: any;
declare var Materialize: any;
@Component({
  selector: 'app-lista-asignacion-producto',
  templateUrl: './lista-asignacion-producto.component.html',
  providers: [ ListaAsignacionProductoService ]
})
export class ListaAsignacionProductoComponent  implements OnInit, AfterViewInit{

  public loading: boolean;
  public mensajeModal: string;

  public asignaciones: Array<ProductoAsignacion>;

  constructor(private auth: AuthService,
    private service: ListaAsignacionProductoService
  ) { }

  ngOnInit() {
    this.loading = true;
    this.service.getAllAsignacionesByYear(this.auth.getIdUsuario(), getAnioActual()).subscribe(result => {
      if (result.response.sucessfull) {
        this.asignaciones = result.data.listProductoAsignacion || [];
        this.loading = false;
      } else {
        Materialize.toast('Ocurrió  un error al consultar las metas!', 4000, 'red');
        this.loading = false;
      }
    }, error => {
      Materialize.toast('Ocurrió  un error en el servicio!', 4000, 'red');
      this.loading = false;
    });
  }

   /* 
   * Carga de plugins para el componente
   */ 
  ngAfterViewInit(): void {
    $('.datepicker').pickadate({
      selectMonths: true, // Creates a dropdown to control month
      selectYears: 15, // Creates a dropdown of 15 years to control year,
      today: 'Hoy',
      clear: 'Limpiar',
      close: 'Ok',
      monthsFull: [ 'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre' ],
      monthsShort: [ 'Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic' ],
      weekdaysShort: [ 'Dom', 'Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab' ],
      weekdaysLetter: [ 'D', 'L', 'M', 'M', 'J', 'V', 'S' ],
      format: 'dd/mm/yyyy',
      closeOnSelect: false // Close upon selecting a date,
    });

    $('.tooltipped').tooltip({ delay: 50 });
  }


  agregar() {
    $('.tooltipped').tooltip('hide');
  }

  regresar() {
    $('.tooltipped').tooltip('hide');
  }

  openModalConfirmacion(asignacion: ProductoAsignacion, accion: string, event?: any): void {
    this.mensajeModal = '';

    switch (accion) {
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
      html: '<p style="color: #303f9f "> Asignación para el producto: <b>' + asignacion.descripcion + ' </b></p>',
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
          case 'eliminar':
            this.service.delete(this.auth.getIdUsuario(), asignacion.id_asignacion).subscribe(result => {
              if (result.response.sucessfull) {
                deleteItemArray(this.asignaciones, asignacion.id_asignacion, 'propety');
                Materialize.toast('Se eliminó correctamente ', 4000, 'green');
              } else {
                Materialize.toast(result.response.message, 4000, 'red');
              }
            }, error => {
              Materialize.toast('Ocurrió  un error en el servicio!', 4000, 'red');
            });
            break;
        }
        /*
        * Si cancela accion
        */
      } else if (result.dismiss === swal.DismissReason.cancel) {
      }
    })

  }

}