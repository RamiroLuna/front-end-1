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
  public loading:boolean;

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
        case 'perdidas':
          this.nombre_catalogo = 'Perdida';
          this.nombre_tabla = 'pet_cat_perdida';
          this.type_Catalogo = 'generico';
          break;
        case 'planeado':
          this.nombre_catalogo = 'Paro planeado';
          this.nombre_tabla = 'pet_cat_planeado';
          this.type_Catalogo = 'generico';
          break;
        case 'no_planeado':
          this.nombre_catalogo = 'Paro no planeado';
          this.nombre_tabla = 'pet_cat_noplaneado';
          this.type_Catalogo = 'generico';
          break;
        case 'reduccion':
          this.nombre_catalogo = 'Reducción';
          this.nombre_tabla = 'pet_cat_reduc_velocidad';
          this.type_Catalogo = 'generico';
          break;
        case 'calidad':
          this.nombre_catalogo = 'Calidad';
          this.nombre_tabla = 'pet_cat_calidad';
          this.type_Catalogo = 'generico';
          break;
        case 'extrusores':
          this.nombre_catalogo = 'Nombre de equipos extrusores';
          this.nombre_tabla = 'pet_cat_equipos_extrusores_bulher';
          this.type_Catalogo = 'generico';
          break;
        case 'ssp':
          this.nombre_catalogo = 'Nombre de equipos SSP';
          this.nombre_tabla = 'pet_cat_equipos_ssp';
          this.type_Catalogo = 'generico';
          break;
        case 'grupo-linea':
          this.nombre_catalogo = 'Grupos de linea';
          this.nombre_tabla = 'pet_cat_gpo_linea';
          this.type_Catalogo = 'generico';
          break;
        case 'grupos':
          this.nombre_catalogo = 'Grupos';
          this.nombre_tabla = 'pet_cat_grupos';
          this.type_Catalogo = 'generico';
          break;
        case 'perfiles':
          this.nombre_catalogo = 'Perfiles';
          this.nombre_tabla = 'pet_cat_perfiles';
          this.type_Catalogo = 'generico';
          break;
        case 'turnos':
          this.nombre_catalogo = 'Turno';
          this.nombre_tabla = 'pet_cat_turnos';
          this.type_Catalogo = 'generico';
          break;
        case 'lineas':
          this.nombre_catalogo = 'Lineas';
          this.nombre_tabla = 'pet_cat_lineas';
          this.type_Catalogo = 'lineas';
          break;
        case 'equipos_amut':
          this.nombre_catalogo = 'Equipos Amut';
          this.nombre_tabla = 'pet_cat_nombre_equipo_amut';
          this.type_Catalogo = 'equipos_amut';
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
          setTimeout(() => {this.ngAfterViewHttp();},200)
        } else {
          Materialize.toast(result.response.message, 4000, 'red');
          this.loading = false;
        }
      }, error => {
        Materialize.toast('Ocurrió un error en el servicio!', 4000, 'red');
        this.loading = false;
      });
    } else if (this.type_Catalogo == 'lineas') {

      this.service.getElementsLineas(this.auth.getIdUsuario(), this.nombre_tabla).subscribe(result => {
        if (result.response.sucessfull) {
          this.items = result.data.listLineasDTO;
          this.loading = false;
          setTimeout(() => {this.ngAfterViewHttp();},200)
        } else {
          Materialize.toast(result.response.message, 4000, 'red');
          this.loading = false;
        }
      }, error => {
        Materialize.toast('Ocurrió un error en el servicio!', 4000, 'red');
        this.loading = false;
      });

    } else if (this.type_Catalogo == 'equipos_amut') {
      this.service.getElementsEquipos(this.auth.getIdUsuario()).subscribe(result => {
        if (result.response.sucessfull) {
          this.items = result.data.listEquipoAmut;
          this.loading = false;
          setTimeout(() => {this.ngAfterViewHttp();},200)
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
      html: '<p style="color: #303f9f "> Detalle: <b>' + (item.descripcion || item.nombre_equipo) + ' </b></p>',
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
            } else if (accion == 'eliminar') {
              this.service.delete(
                this.auth.getIdUsuario(),
                this.nombre_tabla,
                item.id
              ).subscribe(result => {
                if (result.response.sucessfull) {
                  deleteItemArray(this.items, item.id, 'id');
                  Materialize.toast('Se eliminó correctamente ', 4000, 'green');
                } else {
                  Materialize.toast(result.response.message, 4000, 'red');
                }
              }, error => {
                Materialize.toast('Ocurrió un error en el servicio!', 4000, 'red');
              });
            }
            break;
          /*
           * Codigo para acciones de catalogo de lineas
           */
          case 'lineas':
            if (accion == 'activar') {
              this.service.updateLinea(
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
            } else if (accion == 'eliminar') {
              this.service.deleteLinea(
                this.auth.getIdUsuario(),
                item.id_linea
              ).subscribe(result => {
                if (result.response.sucessfull) {
                  deleteItemArray(this.items, item.id_linea, 'id_linea');
                  Materialize.toast('Se eliminó correctamente ', 4000, 'green');
                } else {
                  Materialize.toast(result.response.message, 4000, 'red');
                }
              }, error => {
                Materialize.toast('Ocurrió un error en el servicio!', 4000, 'red');
              });
            }
            break;

          case 'equipos_amut':
            if (accion == 'activar') {
              this.service.updateEquipoAmut(
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
            } else if (accion == 'eliminar') {
              this.service.deleteEquipoAmut(
                this.auth.getIdUsuario(),
                item.id_equipo_amut
              ).subscribe(result => {
                if (result.response.sucessfull) {
                  deleteItemArray(this.items, item.id_equipo_amut, 'id_equipo_amut');
                  Materialize.toast('Se eliminó correctamente ', 4000, 'green');
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
