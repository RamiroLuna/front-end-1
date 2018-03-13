import { Component, OnInit, AfterViewInit, AfterContentInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ListByCatalogService } from './list-by-catalog.service';
import { Catalogo } from '../../models/catalogo';
import { AuthService } from '../../auth/auth.service';
import { deleteItemArray } from '../../utils';

declare var $: any;
declare var Materialize: any;
@Component({
  selector: 'app-list-by-catalog',
  templateUrl: './list-by-catalog.component.html',
  providers: [ListByCatalogService]
})
export class ListByCatalogComponent implements OnInit, AfterViewInit {

  public nombre_catalogo: string;
  public nombre_tabla: string;
  public isCatalog: boolean = true;
  public tipo_catalogo: string;
  public mensajeModal: string;
  public items: Array<Catalogo>;
  public objtmp: any;
  public accion: string;
  public item_selected: Catalogo;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private service: ListByCatalogService,
    private auth: AuthService
  ) { }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.tipo_catalogo = params.get('name');
      switch (this.tipo_catalogo) {
        case 'perdidas':
          this.nombre_catalogo = 'Perdida';
          this.nombre_tabla = 'pet_cat_perdida';
          break;
        case 'planeado':
          this.nombre_catalogo = 'Paro planeado';
          this.nombre_tabla = 'pet_cat_planeado';
          break;
        case 'no_planeado':
          this.nombre_catalogo = 'Paro no planeado';
          this.nombre_tabla = 'pet_cat_noplaneado';
          break;
        case 'reduccion':
          this.nombre_catalogo = 'Reducción';
          this.nombre_tabla = 'pet_cat_reduc_velocidad';
          break;
        case 'calidad':
          this.nombre_catalogo = 'Calidad';
          this.nombre_tabla = 'pet_cat_calidad';
          break;
        case 'extrusores':
          this.nombre_catalogo = 'Nombre de equipos extrusores';
          this.nombre_tabla = 'pet_cat_equipos_extrusores_bulher';
          break;
        case 'ssp':
          this.nombre_catalogo = 'Nombre de equipos SSP';
          this.nombre_tabla = 'pet_cat_equipos_ssp';
          break;
        case 'grupo-linea':
          this.nombre_catalogo = 'Grupos de linea';
          this.nombre_tabla = 'pet_cat_gpo_linea';
          break;
        case 'grupos':
          this.nombre_catalogo = 'Grupos';
          this.nombre_tabla = 'pet_cat_grupos';
          break;
        case 'perfiles':
          this.nombre_catalogo = 'Perfiles';
          this.nombre_tabla = 'pet_cat_perfiles';
          break;
        case 'turnos':
          this.nombre_catalogo = 'Turno';
          this.nombre_tabla = 'pet_cat_turnos';
          break;
        default:
          this.isCatalog = false;
      }

    });

    this.service.getElementsByCatalog(this.auth.getIdUsuario(), this.nombre_tabla).subscribe(result => {
      if (result.response.sucessfull) {
        this.items = result.data.listCatalogosDTO;
       
      } else {
        Materialize.toast(result.response.message, 4000, 'red');
      }
    }, error => {
      Materialize.toast('Ocurrió un error en el servicio!', 4000, 'red');
    });

  }

  ngAfterViewInit() {
    $('.tooltipped').tooltip({ delay: 50 });
    $('#modalConfirmacion').modal({
      dismissible: false
    });
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

  /*
   * Acciones para bloquear 
   */
  openModalActivar(event, catalogo: Catalogo) {
    this.item_selected = catalogo;
    this.objtmp = event;
    this.item_selected.activo = event.target.checked ? 1 : 0;
    this.accion = 'activar';
    this.mensajeModal = '¿Esta seguro que desea' + (event.target.checked ? ' activar ' : ' desactivar ') + catalogo.descripcion + ' ?';
    $('#modalConfirmacion').modal('open');
  }

  /*
   * Acciones para eliminar
   */

  openModalDelete(catalogo: Catalogo) {
    this.item_selected = catalogo;
    this.accion = 'eliminar';
    this.mensajeModal = '¿Esta seguro que desea eliminar ' + catalogo.descripcion + ' ? ';
    $('#modalConfirmacion').modal('open');
  }


  /*
   * Si confirma la accion
   */

  aceptarAccion(accion_ejecuta: string) {
    switch (accion_ejecuta) {
      case 'activar':
        this.service.update(
          this.auth.getIdUsuario(),
          this.nombre_tabla,
          this.item_selected
        ).subscribe(result => {
          if (result.response.sucessfull) {
            Materialize.toast('Actualización completa', 4000, 'green');
            $('#modalConfirmacion').modal('close');
          } else {
            Materialize.toast(result.response.message, 4000, 'red');
          }
        }, error => {

          Materialize.toast('Ocurrió un error en el servicio!', 4000, 'red');
        });
        break;
      case 'eliminar':
        this.service.delete(
          this.auth.getIdUsuario(),
          this.nombre_tabla,
          this.item_selected.id
        ).subscribe(result => {
          if (result.response.sucessfull) {
            deleteItemArray(this.items, this.item_selected.id, 'id');
            Materialize.toast('Se eliminó correctamente ', 4000, 'green');
            $('#modalConfirmacion').modal('close');
          } else {
            Materialize.toast(result.response.message, 4000, 'red');
          }
        }, error => {
          Materialize.toast('Ocurrió un error en el servicio!', 4000, 'red');
        });
        break;
    }
  }


  /*
  * Si cancela la accion
  */
  closeModal(action: string) {
    if (action == 'activar') {
      //Si cancela regresa el valor de activo al anterior
      this.objtmp.target.checked = !this.objtmp.target.checked;
      this.item_selected.activo = !this.objtmp.target.checked ? 1 : 0;
    }
    this.item_selected = null;
    this.accion = '';
    $('#modalConfirmacion').modal('close');
  }


}
