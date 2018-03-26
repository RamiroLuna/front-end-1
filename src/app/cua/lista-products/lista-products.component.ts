import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../auth/auth.service';
import { ListaProductsService } from './lista-products.service';
import { Producto } from '../../models/producto';
import { DataTable, deleteItemArray } from '../../utils';
import swal from 'sweetalert2';

declare var $: any;
declare var Materialize: any;
@Component({
  selector: 'app-lista-products',
  templateUrl: './lista-products.component.html',
  providers: [ ListaProductsService ]
})
export class ListaProductsComponent  implements OnInit {
  public loading: boolean;
  public mensajeModal: string;
  public productos: Array<Producto>;

  constructor(
    private auth: AuthService,
    private service: ListaProductsService
  ) { }

  ngOnInit() {
    this.loading = true;
    this.service.getProductos(this.auth.getIdUsuario()).subscribe(result => {
      if (result.response.sucessfull) {
        this.productos = result.data.listProductos || [];
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

  ngAfterViewInit(): void {
    $('.tooltipped').tooltip({ delay: 50 });
  }

  agregar() {
    $('.tooltipped').tooltip('hide');
  }

  regresar() {
    $('.tooltipped').tooltip('hide');
  }

    /*
   * Carga plugins despues de cargar y mostrar objetos en el DOM
   */
  ngAfterViewHttp(): void {

    DataTable('#tabla');

    $('.tooltipped').tooltip({ delay: 50 });
  }

  openModalConfirmacion(producto: Producto, accion: string, event?: any): void {
    this.mensajeModal = '';

    switch (accion) {
      case 'activar':
        producto.activo = event.target.checked ? 1 : 0;
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
      html: '<p style="color: #303f9f "> Producto: <b>' + producto.producto + ' </b><br> Linea: '+ producto.linea+'</p>',
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
            this.service.update(this.auth.getIdUsuario(), producto).subscribe(result => {
              if (result.response.sucessfull) {
                Materialize.toast('Actualización completa', 4000, 'green');

              } else {
                Materialize.toast(result.response.message, 4000, 'red');
                producto.activo = !producto.activo?1:0;
              }
            }, error => {
              producto.activo = !producto.activo?1:0;
              Materialize.toast('Ocurrió  un error en el servicio!', 4000, 'red');
            });
            break;
        }
        /*
        * Si cancela accion
        */
      } else if (result.dismiss === swal.DismissReason.cancel) {
        switch (accion) {
          case 'activar':
            producto.activo = !producto.activo ? 1 : 0;
            event.target.checked = !event.target.checked;
            break;
        }

      }
    })

  }

}
