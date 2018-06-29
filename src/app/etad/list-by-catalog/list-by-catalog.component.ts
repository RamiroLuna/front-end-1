import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ListByCatalogService } from './list-by-catalog.service';
import { AuthService } from '../../auth/auth.service';
import { deleteItemArray } from '../../utils';
import { PetCatKpiOperativo } from '../../models/pet-cat-kpi-operativo';
import { PetCatMetaEstrategica } from '../../models/pet-cat-meta-estrategica';
import { PetCatObjetivoOperativo } from '../../models/pet-cat-objetivo-operativo';
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
  public id_tipo_catalogo: number;

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
        case 'metas-estrategicas':
          this.nombre_catalogo = 'Metas estratégicas';
          this.nombre_tabla = 'pet_cat_meta_estrategica';
          this.type_Catalogo = 'metas-estrategicas';
          this.id_tipo_catalogo = 1;
          break;
        case 'objetivos-operativos':
          this.nombre_catalogo = 'Objetivos Operativos';
          this.nombre_tabla = 'pet_cat_objetivo_operativo';
          this.type_Catalogo = 'objetivos-operativos';
          this.id_tipo_catalogo = 2;
          break;
        case 'kpis-operativos':
          this.nombre_catalogo = 'KPI Operativos';
          this.nombre_tabla = 'pet_cat_kpi_operativo';
          this.type_Catalogo = 'kpis-operativos';
          this.id_tipo_catalogo = 3;
          break;

        default:
          this.isCatalog = false;
      }

    });

    switch (this.id_tipo_catalogo) {

      case 1:
      case 2:
      case 3:
        this.service.getAllCatalogos(this.auth.getIdUsuario(), this.id_tipo_catalogo).subscribe(result => {
          console.log('get result', result)
          if (result.response.sucessfull) {
            switch (this.id_tipo_catalogo) {
              case 1:
                this.items = this.items as Array<PetCatMetaEstrategica>;
                this.items = result.data.listMetasEstrategicas || [];
                break;
              case 2:
                this.items = this.items as Array<PetCatObjetivoOperativo>;
                this.items = result.data.listObjetivoOperativos || [];
                break;
              case 3:
                this.items = this.items as Array<PetCatKpiOperativo>;
                this.items = result.data.listKpiOperativos || [];
                break;
            }
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
        break;

      default:
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

          case 'metas-estrategicas':
          case 'objetivos-operativos':
          case 'kpis-operativos':
            let action = (item.activo == 1)?'unlockRecord':'blockRecord';
            if (accion == 'activar') {
              this.service.update(this.auth.getIdUsuario(),item, this.id_tipo_catalogo,action).subscribe(result => {
                if (result.response.sucessfull) {
                  Materialize.toast('Se ' + ( (item.activo == 1)?'activó':'desactivó' ) + ' correctamente', 4000, 'green');
                } else {
                  item.activo = !item.activo ? 1 : 0;
                  event.target.checked = !event.target.checked;
                  Materialize.toast(result.response.message, 4000, 'red');
                }
              }, error => {
                item.activo = !item.activo ? 1 : 0;
                event.target.checked = !event.target.checked;
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
