import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../auth/auth.service';
import { ProductoAsignacion } from '../../models/producto-asignacion';
import { ListaAsignacionProductoService } from './lista-asignacion-producto.service';
import { deleteItemArray, getFechaActual, DataTable, getMilisegundos } from '../../utils';
import swal from 'sweetalert2';
import { MetaAsignacion } from '../../models/meta-asignacion';

declare var $: any;
declare var Materialize: any;
@Component({
  selector: 'app-lista-asignacion-producto',
  templateUrl: './lista-asignacion-producto.component.html',
  providers: [ListaAsignacionProductoService]
})
export class ListaAsignacionProductoComponent implements OnInit {

  public loading: boolean;
  public mensajeModal: string;
  public asignaciones: Array<MetaAsignacion>;

  public inicio: string = "";
  public fin: string = "";
  public show_lista: boolean = true;

  /*
   * Variables que se enviarán al componente hijo
   */
  public asignacion_seleccionada: MetaAsignacion;
  /*
   * Fin de variables que se enviarán al hijo
   */ 

  constructor(private auth: AuthService,
    private service: ListaAsignacionProductoService
  ) { }

  ngOnInit() {
    this.loading = true;
    this.inicio = getFechaActual();
    this.fin = getFechaActual();
    this.service.getAllAsignacionMetasByDays(this.auth.getIdUsuario(), this.auth.getPerfil(), this.auth.getId_Grupo(), this.auth.getId_Linea(),this.inicio, this.fin).subscribe(result => {
     
      if (result.response.sucessfull) {
        this.asignaciones = result.data.listMetasAsignacion || [];
        this.loading = false;
        setTimeout(() => { this.ngAfterViewHttp() }, 200)
      } else {
        Materialize.toast(result.response.message, 4000, 'red');
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
  ngAfterViewHttp(): void {
    
    DataTable('#tabla');

    $('#inicio,#fin').pickadate({
      selectMonths: true, // Creates a dropdown to control month
      selectYears: 15, // Creates a dropdown of 15 years to control year,
      today: 'Hoy',
      clear: '',
      close: 'Ok',
      monthsFull: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
      monthsShort: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
      weekdaysShort: ['Dom', 'Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab'],
      weekdaysLetter: ['D', 'L', 'M', 'M', 'J', 'V', 'S'],
      format: 'dd/mm/yyyy',
      closeOnSelect: false,
      onClose: () => {
        this.inicio = $('#inicio').val();
        this.fin = $('#fin').val();
      }
    });

    $('.tooltipped').tooltip({ delay: 50 });
    Materialize.updateTextFields();
  }

  busqueda(): void {
    this.loading = true;
    if (getMilisegundos(this.inicio) <= getMilisegundos(this.fin)) {
      this.service.getAllAsignacionMetasByDays(this.auth.getIdUsuario(), this.auth.getPerfil(), this.auth.getId_Grupo(), this.auth.getId_Linea(), this.inicio, this.fin).subscribe(result => {
      
        if (result.response.sucessfull) {
          this.asignaciones = result.data.listMetasAsignacion || [];
          this.loading = false;
          setTimeout(() => { this.ngAfterViewHttp() }, 200)
        } else {
          Materialize.toast(result.response.message, 4000, 'red');
          this.loading = false;
        }
      }, error => {
        Materialize.toast('Ocurrió  un error en el servicio!', 4000, 'red');
        this.loading = false;
      });
    } else {
      this.loading = false;
      Materialize.toast('La fecha de inicio debe ser menor a la fecha fin', 4000, 'red')
    }
  }

  asignarValorProducto(event, asignacion:MetaAsignacion):void{
      this.asignacion_seleccionada = asignacion;
      this.show_lista = false;
  }

  verListaAsignaciones():void{
    this.asignacion_seleccionada = null;
    this.show_lista = true;
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
