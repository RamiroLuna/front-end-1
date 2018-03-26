import { Component, OnInit } from '@angular/core';
import { Meta } from '../../models/meta';
import { deleteItemArray,DataTable } from '../../utils';
import swal from 'sweetalert2';
import { AuthService } from '../../auth/auth.service';
import { ListaMetasService } from './lista-metas.service';

declare var $: any;
declare var Materialize: any;
@Component({
  selector: 'app-lista-metas',
  templateUrl: './lista-metas.component.html',
  providers: [ ListaMetasService ]
})
export class ListaMetasComponent implements OnInit{
  public loading: boolean;
  public mensajeModal: string;

  public metas: Array<Meta>;

  constructor(
    private auth: AuthService,
    private service: ListaMetasService
  ) { }

  ngOnInit() {
    this.loading = true;
    this.service.getMetas(this.auth.getIdUsuario()).subscribe(result => {
      if (result.response.sucessfull) {
        this.metas = result.data.listMetas || [];
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
    
  }

  /*
   * Carga plugins despues de cargar y mostrar objetos en el DOM
   */
  ngAfterViewHttp(): void {

    DataTable('#tabla');
    $('.tooltipped').tooltip({ delay: 50 });
  } 


  agregar() {
    $('.tooltipped').tooltip('hide');
  }

  regresar() {
    $('.tooltipped').tooltip('hide');
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
      html: '<p style="color: #303f9f "> Meta : <b>' + meta.meta + ' </b></p>',
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
            this.service.update(this.auth.getIdUsuario(), meta).subscribe(result => {
              if (result.response.sucessfull) {
                Materialize.toast('Actualización completa', 4000, 'green');

              } else {
                Materialize.toast(result.response.message, 4000, 'red');
                meta.activo = !meta.activo?1:0;
              }
            }, error => {
              meta.activo = !meta.activo?1:0;
              Materialize.toast('Ocurrió  un error en el servicio!', 4000, 'red');
            });
            break;
          case 'eliminar':
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
