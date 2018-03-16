import { Component, OnInit, AfterViewInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { Catalogo } from '../../../models/catalogo';
import { Linea } from '../../../models/linea';
import { EquipoAmut } from '../../../models/equipo-amut';
import { isValidId } from '../../../utils';
import { AuthService } from '../../../auth/auth.service';
import { FormularioDetalleServiceService } from './formulario-detalle-service.service';
import swal from 'sweetalert2';

declare var $: any;
declare var Materialize: any;
@Component({
  selector: 'app-formulario-detalle',
  templateUrl: './formulario-detalle.component.html',
  providers: [FormularioDetalleServiceService]
})
export class FormularioDetalleComponent implements OnInit, AfterViewInit {

  public nombre_catalogo: string;
  public nombre_tabla: string;
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
  public grupos_lineas: Array<Catalogo> = [];

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private service: FormularioDetalleServiceService,
    private auth: AuthService
  ) { }

  ngOnInit() {
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
          case 'perdidas':
            this.nombre_catalogo = 'Perdida';
            this.nombre_tabla = 'pet_cat_perdida';
            this.type_Catalogo = 'generico';
            this.itemCatalogo = new Catalogo();
            break;
          case 'planeado':
            this.nombre_catalogo = 'Paro planeado';
            this.nombre_tabla = 'pet_cat_planeado';
            this.type_Catalogo = 'generico';
            this.itemCatalogo = new Catalogo();
            break;
          case 'no_planeado':
            this.nombre_catalogo = 'Paro no planeado';
            this.nombre_tabla = 'pet_cat_noplaneado';
            this.type_Catalogo = 'generico';
            this.itemCatalogo = new Catalogo();
            break;
          case 'reduccion':
            this.nombre_catalogo = 'Reducción';
            this.nombre_tabla = 'pet_cat_reduc_velocidad';
            this.type_Catalogo = 'generico';
            this.itemCatalogo = new Catalogo();
            break;
          case 'calidad':
            this.nombre_catalogo = 'Calidad';
            this.nombre_tabla = 'pet_cat_calidad';
            this.type_Catalogo = 'generico';
            this.itemCatalogo = new Catalogo();
            break;
          case 'extrusores':
            this.nombre_catalogo = 'Nombre de equipos extrusores';
            this.nombre_tabla = 'pet_cat_equipos_extrusores_bulher';
            this.type_Catalogo = 'generico';
            this.itemCatalogo = new Catalogo();
            break;
          case 'ssp':
            this.nombre_catalogo = 'Nombre de equipos SSP';
            this.nombre_tabla = 'pet_cat_equipos_ssp';
            this.type_Catalogo = 'generico';
            this.itemCatalogo = new Catalogo();
            break;
          case 'grupo-linea':
            this.nombre_catalogo = 'Grupos de linea';
            this.nombre_tabla = 'pet_cat_gpo_linea';
            this.type_Catalogo = 'generico';
            this.itemCatalogo = new Catalogo();
            break;
          case 'grupos':
            this.nombre_catalogo = 'Grupos';
            this.nombre_tabla = 'pet_cat_grupos';
            this.type_Catalogo = 'generico';
            this.itemCatalogo = new Catalogo();
            break;
          case 'perfiles':
            this.nombre_catalogo = 'Perfiles';
            this.nombre_tabla = 'pet_cat_perfiles';
            this.type_Catalogo = 'generico';
            this.itemCatalogo = new Catalogo();
            break;
          case 'turnos':
            this.nombre_catalogo = 'Turno';
            this.nombre_tabla = 'pet_cat_turnos';
            this.type_Catalogo = 'generico';
            this.itemCatalogo = new Catalogo();
            break;
          case 'lineas':
            this.nombre_catalogo = 'Lineas';
            this.nombre_tabla = 'pet_cat_lineas';
            this.type_Catalogo = 'lineas';
            this.itemCatalogo = new Linea();
            this.loadDataDependsLineas();
            break;
          case 'equipos_amut':
            this.nombre_catalogo = 'Equipos Amut';
            this.nombre_tabla = 'pet_cat_nombre_equipo_amut';
            this.type_Catalogo = 'equipos_amut';
            this.itemCatalogo = new EquipoAmut();
            break;
          default:
            this.isCatalog = false;
        }

        if (this.seccion == 'edit') {
          this.loadData(this.type_Catalogo, parseInt(params.get('id')));
        }
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

      case 'generico':
        this.formCatalogs = this.fb.group({
          descripcion: new FormControl(this.itemCatalogo.descripcion, [Validators.required])
        });
        break;
      case 'lineas':
        this.formCatalogs = this.fb.group({
          descripcion: new FormControl(this.itemCatalogo.descripcion, [Validators.required]),
          id_gpo_linea: new FormControl(this.itemCatalogo.id_gpo_linea, [Validators.required])
        });
        break;
      case 'equipos_amut':
        this.formCatalogs = this.fb.group({
          clave_equipo: new FormControl(this.itemCatalogo.clave_equipo, [Validators.required]),
          nombre_equipo: new FormControl(this.itemCatalogo.nombre_equipo, [Validators.required])
        });
        break;
    }
  }

  loadData(typeCatalogo: string, id: number) {
    switch (typeCatalogo) {
      case 'generico':
        this.service.getElementById(this.auth.getIdUsuario(), this.nombre_tabla, id).subscribe(result => {
          if (result.response.sucessfull) {
            this.itemCatalogo = result.data.catalogosDTO;
          } else {
            Materialize.toast(result.response.message, 4000, 'red');
          }
        }, error => {
          Materialize.toast('Ocurrió un error en el servicio!', 4000, 'red');
        });
        break;
      case 'lineas':
        /*
         * Consulta el elemento del catalogo
         */
        this.service.getElementLineaById(this.auth.getIdUsuario(), id).subscribe(result => {
          if (result.response.sucessfull) {
            this.itemCatalogo = result.data.lineasDTO;
          } else {
            Materialize.toast(result.response.message, 4000, 'red');
          }
        }, error => {
          Materialize.toast('Ocurrió un error en el servicio!', 4000, 'red');
        });
        break;
      case 'equipos_amut':
        /*
         * Consulta el elemento del catalogo
         */
        this.service.getElementEquipoAmutById(this.auth.getIdUsuario(), id).subscribe(result => {
          if (result.response.sucessfull) {
            this.itemCatalogo = result.data.equipoAmut;
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
   * Carga los datos de los que depende lineas
   */
  loadDataDependsLineas(): void {
    this.service.getElementsCatalogo(this.auth.getIdUsuario(), 'pet_cat_gpo_linea').subscribe(result => {
      if (result.response.sucessfull) {
        this.grupos_lineas = result.data.listCatalogosDTO;
      } else {
        Materialize.toast('No se cargó catalogo de grupo de lineas', 4000, 'red');
      }
    }, error => {
      Materialize.toast('Ocurrió un error en el servicio!', 4000, 'red');
    });
  }

  openModalConfirmacion(item: any, accion: string, type: string): void {

    this.submitted = true;
    this.mensajeModal = '';

    if (this.formCatalogs.valid) {

      switch (accion) {
        case 'add':
          this.mensajeModal = '¿Está seguro de agregar ? ';
          break;
        case 'edit':
          this.mensajeModal = '¿ Está seguro de actualizar la información ? ';
          break;
      }
      /* 
       * Configuración del modal de confirmación
       */
      swal({
        title: '<span style="color: #303f9f ">' + this.mensajeModal + '</span>',
        type: 'question',
        html: '<p style="color: #303f9f "> Elemento : <b>' + (item.descripcion || item.nombre_equipo) + ' </b></p>',
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
              if (this.seccion == 'add') {
                this.service.agregar(this.auth.getIdUsuario(), this.nombre_tabla, this.itemCatalogo).subscribe(result => {
                  if (result.response.sucessfull) {
                    Materialize.toast('Se agregó correctamente', 4000, 'green');
                    this.router.navigate(['home/catalogos/lista', this.link_back]);
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
            /*
             * Codigo para acciones de catalogo de lineas
             */
            case 'lineas':
              if (this.seccion == 'add') {
                this.service.agregarLinea(this.auth.getIdUsuario(), this.itemCatalogo).subscribe(result => {
                  if (result.response.sucessfull) {
                    Materialize.toast('Se agregó correctamente', 4000, 'green');
                    this.router.navigate(['home/catalogos/lista', this.link_back]);
                  } else {
                    Materialize.toast(result.response.message, 4000, 'red');
                  }
                }, eror => {
                  Materialize.toast('Ocurrió un error en el servicio!', 4000, 'red');
                });
              } else if (this.seccion == 'edit') {
                this.service.updateLinea(this.auth.getIdUsuario(), this.itemCatalogo).subscribe(
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

            case 'equipos_amut':
              if (this.seccion == 'add') {
                this.service.agregarEquipoAmut(this.auth.getIdUsuario(), this.itemCatalogo).subscribe(result => {
                  if (result.response.sucessfull) {
                    Materialize.toast('Se agregó correctamente', 4000, 'green');
                    this.router.navigate(['home/catalogos/lista', this.link_back]);
                  } else {
                    Materialize.toast(result.response.message, 4000, 'red');
                  }
                }, eror => {
                  Materialize.toast('Ocurrió un error en el servicio!', 4000, 'red');
                });
              } else if (this.seccion == 'edit') {
                this.service.updateEquipoAmut(this.auth.getIdUsuario(), this.itemCatalogo).subscribe(
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
      Materialize.toast('Se encontrarón errores!', 4000, 'red');
    }

  }



}


