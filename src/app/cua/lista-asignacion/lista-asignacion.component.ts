import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../auth/auth.service';
import { MetaAsignacion } from '../../models/meta-asignacion';
import { deleteItemArray, getAnioActual, DataTable, getYears} from '../../utils';
import swal from 'sweetalert2';
import { ListaAsignacionService } from './lista-asignacion.service';


declare var $: any;
declare var Materialize: any;
@Component({
  selector: 'app-lista-asignacion',
  templateUrl: './lista-asignacion.component.html',
  providers: [ ListaAsignacionService ]
})
export class ListaAsignacionComponent implements OnInit{
  public loading: boolean;
  public mensajeModal: string;
  public asignaciones: Array<MetaAsignacion>;
  public anio_actual:number;

  constructor(private auth: AuthService,
    private service: ListaAsignacionService
  ) { }

  ngOnInit() {
    this.loading = true;
    this.anio_actual = getAnioActual();
    this.service.getAllAsignacionesByYear(this.auth.getIdUsuario(), this.anio_actual).subscribe(result => {
      console.log('asignaciones', result)
      if (result.response.sucessfull) {
        this.asignaciones = result.data.listMetasAsignacion || [];
        this.loading = false;
        setTimeout(()=>{this.ngAfterViewHttp()},200)
       
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
   ngAfterViewHttp(): void{

    DataTable('#tabla');

    $('.tooltipped').tooltip({ delay: 50 });
   } 


  agregar() {
    $('.tooltipped').tooltip('hide');
  }

  regresar() {
    $('.tooltipped').tooltip('hide');
  }

  openModalYear(event):void{
    event.preventDefault();
    swal({
      title: 'Seleccione el año',
      input: 'select',
      cancelButtonText: 'Cancelar',
      confirmButtonText: 'OK',
      inputOptions: getYears(),
      inputPlaceholder: 'Seleccione año',
      showCancelButton: true,
      inputValidator: (value) => {
        
        return new Promise((resolve) => {
         
          if (value != '') {
            resolve();
            this.loading = true;
            this.anio_actual = value;
            this.asignaciones = [];
            this.service.getAllAsignacionesByYear(this.auth.getIdUsuario(), this.anio_actual).subscribe(result => {
              if (result.response.sucessfull) {
                this.asignaciones = result.data.listMetasAsignacion || [];
                this.loading = false;
                setTimeout(()=>{this.ngAfterViewHttp()},200)
               
              } else {
                Materialize.toast('Ocurrió  un error al consultar las metas!', 4000, 'red');
                this.loading = false;
              }
            }, error => {
              Materialize.toast('Ocurrió  un error en el servicio!', 4000, 'red');
              this.loading = false;
            });
          } else {
            resolve('Seleccione un año')
          }
        })
      }
    })
  }

  openModalConfirmacion(asignacion: MetaAsignacion, accion: string, event?: any): void {
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
      html: '<p style="color: #303f9f "> Asignación para el día: <b>' + asignacion.dia + ' </b></p>',
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
            this.service.delete(this.auth.getIdUsuario(), asignacion.id_pro_meta).subscribe(result => {
              if (result.response.sucessfull) {
                deleteItemArray(this.asignaciones, asignacion.id_pro_meta, 'id_pro_meta');
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
