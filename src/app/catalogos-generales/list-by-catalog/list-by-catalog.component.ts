import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CatalogosGeneralesService } from '../catalogos-generales.service';
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
  providers: [CatalogosGeneralesService]
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
    private service: CatalogosGeneralesService,
    private auth: AuthService
  ) { }

  ngOnInit() {

    this.loading = true;
    this.route.paramMap.subscribe(params => {
      this.tipo_catalogo = params.get('name');

      switch (this.tipo_catalogo) {
        case 'gpos-lineas':
          this.nombre_catalogo = 'Áreas para OEE';
          this.nombre_tabla = 'pet_cat_gpo_linea';
          this.type_Catalogo = 'gpos-lineas';
          this.id_tipo_catalogo = 1;
          break;
        case 'etad-kpis':
          this.nombre_catalogo = 'Etad\'s KPI';
          this.nombre_tabla = 'pet_cat_etad';
          this.type_Catalogo = 'etad-kpis';
          this.id_tipo_catalogo = 2;
          break;
        case 'lineas':
          this.nombre_catalogo = 'Lineas';
          this.nombre_tabla = 'pet_cat_linea';
          this.type_Catalogo = 'lineas';
          this.id_tipo_catalogo = 3;
          break;
        default:
          this.isCatalog = false;
      }

    });

    switch (this.id_tipo_catalogo) {
      case 1:
      case 2:
      case 4:
        this.service.getAllCatalogos(this.auth.getIdUsuario(), this.nombre_tabla).subscribe(result => {
          if (result.response.sucessfull) {
            this.items = result.data.listCatalogosDTO || [];
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
      case 3:
        this.service.getAllLineas(this.auth.getIdUsuario()).subscribe(result => {
          if (result.response.sucessfull) {
            this.items = result.data.listLineasDTO || [];
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
    }


    /* 
     * Configuración del modal de confirmación
     */
    swal({
      title: '<span style="color: #303f9f ">' + this.mensajeModal + '</span>',
      type: 'question',
      html: '<p style="color: #303f9f "> Detalle: <b>' + (item.valor) + ' </b></p>',
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
