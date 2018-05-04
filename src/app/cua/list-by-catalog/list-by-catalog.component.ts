import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ListByCatalogService } from './list-by-catalog.service';
import { Catalogo } from '../../models/catalogo';
import { AuthService } from '../../auth/auth.service';
import { deleteItemArray } from '../../utils';
import swal from 'sweetalert2';

declare var $: any;
declare var Materialize: any;
@Component({
  selector: 'app-list-by-catalog',
  templateUrl: './list-by-catalog.component.html',
  providers: [ListByCatalogService]
})
export class ListByCatalogComponent implements OnInit {

  public nombre_catalogo: string;
  public nombre_tabla: string;
  public isCatalog: boolean = true;
  public tipo_catalogo: string;
  public mensajeModal: string;
  public items: Array<any>;
  public type_Catalogo: string;
  public loading: boolean;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private service: ListByCatalogService,
    private auth: AuthService
  ) { }

  ngOnInit() {
    this.loading = true;
    this.route.paramMap.subscribe(params => {
      this.tipo_catalogo = params.get('name');
      switch (this.tipo_catalogo) {
        case 'fuentes':
          this.nombre_catalogo = 'Fuentes';
          this.nombre_tabla = 'pet_cat_fuentes_paro';
          this.type_Catalogo = 'generico';
          break;
        case 'tipo_productos':
          this.nombre_catalogo = 'Tipos de producto';
          this.nombre_tabla = 'pet_cat_tipo_producto';
          this.type_Catalogo = 'generico';
          break;
        case 'equipos':
          this.nombre_catalogo = 'Equipos';
          this.nombre_tabla = 'pet_cat_equipos';
          this.type_Catalogo = 'equipos';
          break;
        case 'productos':
          this.nombre_catalogo = 'Productos';
          this.nombre_tabla = 'pet_cat_producto';
          this.type_Catalogo = 'productos';
          break;
        case 'razones':
          this.nombre_catalogo = 'Razones de paro';
          this.nombre_tabla = 'pet_cat_razon_paro';
          this.type_Catalogo = 'razones';
          break;

        default:
          this.isCatalog = false;
      }

    });

    if (this.type_Catalogo == 'generico') {
      this.service.getElementsByCatalog(this.auth.getIdUsuario(), this.nombre_tabla).subscribe(result => {
        if (result.response.sucessfull) {
          this.items = result.data.listCatalogosDTO;
          this.loading = false;
          setTimeout(() => { this.ngAfterViewHttp(); }, 200)
        } else {
          Materialize.toast(result.response.message, 4000, 'red');
          this.loading = false;
        }
      }, error => {
        Materialize.toast('Ocurrió un error en el servicio!', 4000, 'red');
        this.loading = false;
      });
    } else if (this.type_Catalogo == 'equipos') {
      this.service.getElementsEquipos(this.auth.getIdUsuario()).subscribe(result => {

        if (result.response.sucessfull) {
          this.items = result.data.listEquipos;
          this.loading = false;
          setTimeout(() => { this.ngAfterViewHttp(); }, 200)
        } else {
          Materialize.toast(result.response.message, 4000, 'red');
          this.loading = false;
        }
      }, error => {
        Materialize.toast('Ocurrió un error en el servicio!', 4000, 'red');
        this.loading = false;
      });

    } else if (this.type_Catalogo == 'productos') {
      this.service.getElementsProductos(this.auth.getIdUsuario()).subscribe(result => {
        if (result.response.sucessfull) {
          this.items = result.data.listProductos || [];
          this.loading = false;
          setTimeout(() => { this.ngAfterViewHttp(); }, 200)
        } else {
          Materialize.toast(result.response.message, 4000, 'red');
          this.loading = false;
        }
      }, error => {
        Materialize.toast('Ocurrió un error en el servicio!', 4000, 'red');
        this.loading = false;
      });

    } else if (this.type_Catalogo == 'razones') {
      this.service.getElementsRazones(this.auth.getIdUsuario()).subscribe(result => {

        if (result.response.sucessfull) {
          this.items = [];
          this.loading = false;
          setTimeout(() => { this.ngAfterViewHttp(); }, 200)
        } else {
          Materialize.toast(result.response.message, 4000, 'red');
          this.loading = false;
        }
      }, error => {
        Materialize.toast('Ocurrió un error en el servicio!', 4000, 'red');
        this.loading = false;
      });

    } else {
      this.loading = false;
    }

  }

  /*
  * Carga plugins despues de cargar y mostrar objetos en el DOM
  */
  ngAfterViewHttp(): void {
    $('.tooltipped').tooltip({ delay: 50 });
  }

  /*
  * Inicia codigo para la funcionalidad del componente
  */

  agregar() {
    $('.tooltipped').tooltip('hide');
  }

  regresar() {
    $('.tooltipped').tooltip('hide');
  }



  openModalConfirmacion(item: any, accion: string, type: string, event?: any): void {


    this.mensajeModal = '';

    switch (accion) {
      case 'activar':
        item.activo = event.target.checked ? 1 : 0;
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
      html: '<p style="color: #303f9f "> Detalle: <b>' + (item.valor || item.nombre_equipo) + ' </b></p>',
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
        /*
         * Determina el tipo de catalogo que es y ejecuta la accion
         */
        switch (type) {
          case 'generico':
            if (accion == 'activar') {
              this.service.update(
                this.auth.getIdUsuario(),
                this.nombre_tabla,
                item
              ).subscribe(result => {
                if (result.response.sucessfull) {
                  Materialize.toast('Actualización completa', 4000, 'green');
                } else {
                  Materialize.toast(result.response.message, 4000, 'red');
                }
              }, error => {
                Materialize.toast('Ocurrió un error en el servicio!', 4000, 'red');
              });
            }
            break;
          case 'equipos':
            if (accion == 'activar') {
              this.service.updateEquipos(
                this.auth.getIdUsuario(),
                item
              ).subscribe(result => {
                if (result.response.sucessfull) {
                  Materialize.toast('Actualización completa', 4000, 'green');
                } else {
                  Materialize.toast(result.response.message, 4000, 'red');
                }
              }, error => {
                Materialize.toast('Ocurrió un error en el servicio!', 4000, 'red');
              });
            }
            break;
          case 'productos':
            if (accion == 'activar') {
              this.service.updateProducto(
                this.auth.getIdUsuario(),
                item
              ).subscribe(result => {
                if (result.response.sucessfull) {
                  Materialize.toast('Actualización completa', 4000, 'green');
                } else {
                  Materialize.toast(result.response.message, 4000, 'red');
                }
              }, error => {
                Materialize.toast('Ocurrió un error en el servicio!', 4000, 'red');
              });
            }
            break;
          case 'razones':
            if (accion == 'activar') {
              this.service.updateRazones(
                this.auth.getIdUsuario(),
                item
              ).subscribe(result => {
                if (result.response.sucessfull) {
                  Materialize.toast('Actualización completa', 4000, 'green');
                } else {
                  Materialize.toast(result.response.message, 4000, 'red');
                }
              }, error => {
                Materialize.toast('Ocurrió un error en el servicio!', 4000, 'red');
              });
            }
            break;
        }
        /*
        * Si cancela accion
        */
      } else if (result.dismiss === swal.DismissReason.cancel) {
        switch (accion) {
          case 'activar':
            item.activo = !item.activo ? 1 : 0;
            event.target.checked = !event.target.checked;
            break;
        }

      }
    })

  }


}
