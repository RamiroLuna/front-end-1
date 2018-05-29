import { Component, OnInit, AfterViewInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { Catalogo } from '../../../models/catalogo';
import { isValidId } from '../../../utils';
import { AuthService } from '../../../auth/auth.service';
import { FormularioDetalleServiceService } from './formulario-detalle-service.service';
import swal from 'sweetalert2';
import { Equipo } from '../../../models/equipo';
import { Producto } from '../../../models/producto';
import { RazonParo } from '../../../models/razon-paro';
import { Linea } from '../../../models/linea';

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
  public tiposProductos: Array<Catalogo>;
  public fuentes: Array<Catalogo>;
  public lineas: Array<Linea>;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private service: FormularioDetalleServiceService,
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
          case 'fuentes':
            this.nombre_catalogo = 'Fuentes';
            this.nombre_tabla = 'pet_cat_fuentes_paro';
            this.type_Catalogo = 'generico';
            this.itemCatalogo = new Catalogo();
            break;
          case 'tipo_productos':
            this.nombre_catalogo = 'Tipos de producto';
            this.nombre_tabla = 'pet_cat_tipo_producto';
            this.type_Catalogo = 'generico';
            this.itemCatalogo = new Catalogo();
            break;
          case 'equipos':
            this.nombre_catalogo = 'Equipos';
            this.nombre_tabla = 'pet_cat_equipos';
            this.type_Catalogo = 'equipos';
            this.itemCatalogo = new Equipo();
            break;
          case 'productos':
            this.nombre_catalogo = 'Productos';
            this.nombre_tabla = 'pet_cat_producto';
            this.type_Catalogo = 'productos';
            this.itemCatalogo = new Producto();
            break;
          case 'razones':
            this.nombre_catalogo = 'Razones de paro';
            this.nombre_tabla = 'pet_cat_razon_paro';
            this.type_Catalogo = 'razones';
            this.itemCatalogo = new RazonParo();
            break;

          default:
            this.isCatalog = false;
        }

        if (this.seccion == 'edit') {
          this.loadData(this.type_Catalogo, parseInt(params.get('id')));
        } else if (this.type_Catalogo == 'productos' && this.seccion == 'add') {
          this.getCatalogosProductos();
        } else if (this.type_Catalogo == 'razones' && this.seccion == 'add') {
          this.getCatalogosRazones();
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

      case 'generico':
        this.formCatalogs = this.fb.group({
          valor: new FormControl(this.itemCatalogo.valor, [Validators.required]),
          descripcion: new FormControl(this.itemCatalogo.descripcion, [Validators.required])
        });
        break;
      case 'equipos':
        this.formCatalogs = this.fb.group({
          valor: new FormControl(this.itemCatalogo.valor, [Validators.required]),
          descripcion: new FormControl(this.itemCatalogo.descripcion, [Validators.required])
        });
        break;
      case 'productos':
        this.formCatalogs = this.fb.group({
          valor: new FormControl(this.itemCatalogo.valor, [Validators.required]),
          descripcion: new FormControl(this.itemCatalogo.descripcion, [Validators.required]),
          id_linea: new FormControl(this.itemCatalogo.id_linea, [Validators.required]),
          id_tipo_producto: new FormControl(this.itemCatalogo.id_tipo_producto, [Validators.required])
        });
        break;
      case 'razones':
        this.formCatalogs = this.fb.group({
          valor: new FormControl(this.itemCatalogo.valor, [Validators.required]),
          descripcion: new FormControl(this.itemCatalogo.descripcion, [Validators.required]),
          id_fuente_paro: new FormControl(this.itemCatalogo.id_fuente_paro, [Validators.required])
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

      case 'equipos':
        /*
         * Consulta el elemento del catalogo
         */
        this.service.getElementEquipoById(this.auth.getIdUsuario(), id).subscribe(result => {
          if (result.response.sucessfull) {
            this.itemCatalogo = result.data.equipo;
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
      case 'productos':
        /*
         * Consulta el elemento del catalogo
         */
        this.service.getElementProductoById(this.auth.getIdUsuario(), id).subscribe(result => {
          if (result.response.sucessfull) {
            this.itemCatalogo = result.data.producto;
            this.lineas = result.data.listLineas || [];
            this.tiposProductos = result.data.listTipoProducto || [];
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
      case 'razones':
        /*
         * Consulta el elemento del catalogo
         */
        this.service.getElementRazonById(this.auth.getIdUsuario(), id).subscribe(result => {
          if (result.response.sucessfull) {
            this.itemCatalogo = result.data.razonParo;
            this.fuentes = result.data.listFuentesParo || [];
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
    }

  }

  getCatalogosProductos() {
    this.service.getInitProductos(this.auth.getIdUsuario()).subscribe(result => {
      if (result.response.sucessfull) {
        this.lineas = result.data.listLineas || [];
        this.tiposProductos = result.data.listTipoProducto || [];
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

  getCatalogosRazones() {
    this.service.getInitRazon(this.auth.getIdUsuario()).subscribe(result => {
      if (result.response.sucessfull) {
        this.fuentes = result.data.listFuentesParo || [];
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
            case 'generico':
              if (this.seccion == 'add') {
                this.service.agregar(this.auth.getIdUsuario(), this.nombre_tabla, this.itemCatalogo).subscribe(result => {
                  if (result.response.sucessfull) {
                    Materialize.toast('Se agregó correctamente', 4000, 'green');
                    this.router.navigate(['home/oee/opciones/catalogos', this.link_back]);
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

            case 'equipos':
              if (this.seccion == 'add') {
                this.service.agregarEquipo(this.auth.getIdUsuario(), this.itemCatalogo).subscribe(result => {
                  if (result.response.sucessfull) {
                    Materialize.toast('Se agregó correctamente', 4000, 'green');
                    this.router.navigate(['home/oee/opciones/catalogos', this.link_back]);
                  } else {
                    Materialize.toast(result.response.message, 4000, 'red');
                  }
                }, eror => {
                  Materialize.toast('Ocurrió un error en el servicio!', 4000, 'red');
                });
              } else if (this.seccion == 'edit') {
                this.service.updateEquipo(this.auth.getIdUsuario(), this.itemCatalogo).subscribe(
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
            case 'productos':
              if (this.seccion == 'add') {
                this.service.agregarProducto(this.auth.getIdUsuario(), this.itemCatalogo).subscribe(result => {
                  if (result.response.sucessfull) {
                    Materialize.toast('Se agregó correctamente', 4000, 'green');
                    this.router.navigate(['home/oee/opciones/catalogos', this.link_back]);
                  } else {
                    Materialize.toast(result.response.message, 4000, 'red');
                  }
                }, eror => {
                  Materialize.toast('Ocurrió un error en el servicio!', 4000, 'red');
                });
              } else if (this.seccion == 'edit') {
                this.service.updateProducto(this.auth.getIdUsuario(), this.itemCatalogo).subscribe(
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
            case 'razones':
              if (this.seccion == 'add') {
                this.service.agregarRazon(this.auth.getIdUsuario(), this.itemCatalogo).subscribe(result => {
                  if (result.response.sucessfull) {
                    Materialize.toast('Se agregó correctamente', 4000, 'green');
                    this.router.navigate(['home/oee/opciones/catalogos', this.link_back]);
                  } else {
                    Materialize.toast(result.response.message, 4000, 'red');
                  }
                }, eror => {
                  Materialize.toast('Ocurrió un error en el servicio!', 4000, 'red');
                });
              } else if (this.seccion == 'edit') {
                this.service.updateRazon(this.auth.getIdUsuario(), this.itemCatalogo).subscribe(
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


