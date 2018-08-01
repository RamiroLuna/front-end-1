import { Component, OnInit, AfterViewInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { isValidId, clone } from '../../utils';
import { AuthService } from '../../auth/auth.service';
import { CatalogosGeneralesService } from '../catalogos-generales.service';
import swal from 'sweetalert2';
import { PetCatKpiOperativo } from '../../models/pet-cat-kpi-operativo';
import { Catalogo } from '../../models/catalogo';
import { Linea } from '../../models/linea';

declare var $: any;
declare var Materialize: any;
@Component({
  selector: 'app-formulario-detalle',
  templateUrl: './formulario-detalle.component.html',
  providers: [CatalogosGeneralesService]
})
export class FormularioDetalleComponent implements OnInit {

  public nombre_catalogo: string;
  public nombre_tabla: string;
  public loading: boolean;
  public isCatalog: boolean = true;
  public link_back: string;
  public formCatalogs: FormGroup;
  public submitted: boolean;
  public itemCatalogo: any; // Esta variable se le  debe indicar el tipo de dato que será en el switch del ngOnit
  public id: string;
  public seccion: string;
  public texto_btn: string;
  public type_Catalogo: string;
  public mensajeModal: string;
  public etads: Array<Catalogo>;
  public grupos: Array<Catalogo>;
  public id_tipo_catalogo: number;
  public tipos_operaciones: Array<any>;


  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private service: CatalogosGeneralesService,
    private auth: AuthService
  ) { }

  ngOnInit() {
    this.loading = true;
    this.submitted = false;
    this.texto_btn = "Cancelar";
    this.route.paramMap.subscribe(params => {

      if (params.get('id') == 'nuevo') {
        this.seccion = 'add';
      } else if (isValidId(params.get('id'))) {
        this.seccion = 'edit';
      } else {
        this.seccion = 'invalid';
      }


      if (this.seccion != 'invalid') {
        switch (params.get('name')) {
          case 'gpos-lineas':
            this.nombre_catalogo = 'Grupos de Línea';
            this.nombre_tabla = 'pet_cat_gpo_linea';
            this.type_Catalogo = 'gpos-lineas';
            this.itemCatalogo = new Catalogo();
            this.id_tipo_catalogo = 1;
            break;
          case 'etad-kpis':
            this.nombre_catalogo = 'Etad\'s KPI';
            this.nombre_tabla = 'pet_cat_etad';
            this.type_Catalogo = 'etad-kpis';
            this.itemCatalogo = new Catalogo();
            this.id_tipo_catalogo = 2;
            break;
          case 'lineas':
            this.nombre_catalogo = 'Lineas';
            this.nombre_tabla = 'pet_cat_linea';
            this.type_Catalogo = 'lineas';
            this.itemCatalogo = new Linea();
            this.id_tipo_catalogo = 3;
            break;

          default:
            this.isCatalog = false;
        }

        if (this.seccion == 'edit') {
          this.loadData(this.type_Catalogo, parseInt(params.get('id')));
        } else if (this.seccion == 'add') {
          if (this.type_Catalogo == 'lineas') {
            this.loadCombox();
          } else {
            this.loadData();
          }
        } else {
          this.loading = false;
        }
      } else {
        this.loading = false;
      }
      this.link_back = params.get('name');
    });

    this.loadFormulario(this.type_Catalogo);

  }

  ngAfterViewInit() {
    $('.tooltipped').tooltip({ delay: 50 });
  }

  /*
   * Selecciona el formControl que se debe cargar
   */
  loadFormulario(typeCatalogo: string) {
    switch (typeCatalogo) {
      case 'gpos-lineas':
      case 'etad-kpis':
        this.formCatalogs = this.fb.group({
          valor: new FormControl(this.itemCatalogo.valor, [Validators.required]),
          descripcion: new FormControl(this.itemCatalogo.descripcion, [Validators.required])
        });
        break;
      case 'lineas':
        this.formCatalogs = this.fb.group({
          valor: new FormControl(this.itemCatalogo.valor, [Validators.required]),
          descripcion: new FormControl(this.itemCatalogo.descripcion, [Validators.required]),
          idGrupoLinea: new FormControl(this.itemCatalogo.id_gpo_linea, [Validators.required]),
          idEtad: new FormControl(this.itemCatalogo.id_etad, [Validators.required])
        });
        break;
    }
  }

  loadCombox(): void {
    this.service.loadCombobox(this.auth.getIdUsuario()).subscribe(result => {
      if (result.response.sucessfull) {
        this.etads = result.data.listEtads || [];
        this.grupos = result.data.listGposLinea || [];
        this.loading = false;
      } else {
        Materialize.toast(result.response.message, 4000, 'red');
        this.loading = false;
      }
    }, error => {
      Materialize.toast('Ocurrió un error en el servicio!', 4000, 'red');
      this.loading = false;
    });
  }

  loadData(typeCatalogo: string = "", id: number = -1) {
    switch (typeCatalogo) {
      case 'gpos-lineas':
      case 'etad-kpis':
        /*
         * Consulta el elemento del catalogo
         */
        this.service.getCatalogoById(this.auth.getIdUsuario(), this.nombre_tabla, id).subscribe(result => {

          if (result.response.sucessfull) {
            this.itemCatalogo = result.data.catalogosDTO || {};
            this.loading = false;
          } else {
            Materialize.toast(result.response.message, 4000, 'red');
            this.loading = false;
          }
        }, error => {
          Materialize.toast('Ocurrió un error en el servicio!', 4000, 'red');
          this.loading = false;
        });
        break;
      case 'lineas':
        /*
        * Consulta el elemento del catalogo
        */
        this.service.getLineaById(this.auth.getIdUsuario(), id).subscribe(result => {
       
          if (result.response.sucessfull) {
            this.itemCatalogo = result.data.lineasDTO || {};
            this.etads = result.data.listEtads || [];
            this.grupos = result.data.listGposLinea || [];
            this.loading = false;
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


  openModalConfirmacion(item: any, accion: string, type: string): void {
    this.submitted = true;
    this.mensajeModal = '';

    if (this.formCatalogs.valid) {

      switch (accion) {
        case 'add':
          this.mensajeModal = '¿Está seguro de agregar? ';
          break;
        case 'edit':
          this.mensajeModal = '¿Está seguro de actualizar la información? ';
          break;
      }
      /* 
       * Configuración del modal de confirmación
       */
      swal({
        title: '<span style="color: #303f9f ">' + this.mensajeModal + '</span>',
        type: 'question',
        html: '<p style="color: #303f9f "> Elemento : <b>' + (item.valor || item.nombre_equipo) + ' </b></p>',
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

            case 'gpos-lineas':
            case 'etad-kpis':

              if (this.seccion == 'add') {
                this.service.agregar(this.auth.getIdUsuario(), this.nombre_tabla, this.itemCatalogo).subscribe(result => {

                  if (result.response.sucessfull) {
                    Materialize.toast('Se agregó correctamente', 4000, 'green');
                    this.router.navigate(['home/catalogos-generales', this.link_back]);
                  } else {
                    Materialize.toast(result.response.message, 4000, 'red');
                  }
                }, eror => {
                  Materialize.toast('Ocurrió un error en el servicio!', 4000, 'red');
                });
              } else if (this.seccion == 'edit') {
                this.service.update(this.auth.getIdUsuario(), this.nombre_tabla, this.itemCatalogo).subscribe(
                  result => {

                    if (result.response.sucessfull) {
                      Materialize.toast('Actualización completa', 4000, 'green');
                      this.texto_btn = 'Cerrar ficha';
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
        }
      })

    } else {
      Materialize.toast('Verifique los datos capturados!', 4000, 'red');
    }

  }


}
