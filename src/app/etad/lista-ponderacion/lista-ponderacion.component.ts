import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../../auth/auth.service';
import { Meta } from '../../models/meta';
import { deleteItemArray, getAnioActual, calculaDiaPorMes, isNumeroAsignacionValid, findRol, clone } from '../../utils';
import swal from 'sweetalert2';
import { ListaPonderacionService } from './lista-ponderacion.service';
import { Catalogo } from '../../models/catalogo';
import { ActivatedRoute, Router } from '@angular/router';
import { PetPonderacionObjetivoOperativo } from '../../models/pet-ponderacion-objetivo-operativo';
import {
  trigger,
  state,
  style,
  animate,
  transition
} from '@angular/animations';
import { PonderacionKpiOperativos } from '../../models/ponderacion-kpi-operativos';


declare var $: any;
declare var Materialize: any;
@Component({
  selector: 'app-lista-ponderacion',
  templateUrl: './lista-ponderacion.component.html',
  providers: [ListaPonderacionService],
  styleUrls: ['/lista-ponderacion.component.css'],
  animations: [
    trigger('visibility', [
      state('inactive', style({
        opacity: 0
      })),
      state('active', style({
        opacity: 1
      })),
      transition('inactive => active', animate('1s ease-in')),
      transition('active => inactive', animate('500ms ease-out'))
    ])
  ]
})
export class ListaPonderacionComponent implements OnInit {

  public loading: boolean;
  public datos_tabla: boolean;
  public mensajeModal: string;
  public anioSeleccionado: number;
  public submitted: boolean;
  public disabled: boolean;
  public ponderaciones: Array<PetPonderacionObjetivoOperativo> = [];
  public ponderaciones_tmp: Array<PetPonderacionObjetivoOperativo> = [];
  public ponderacion_total: number;
  public anios: any = {};
  public status: string;
  public anios_con_obj_cargados: number;

  public disabledInputText: boolean;

  /*
   * tipo_seccion controla la seccion que se mostrara en el template html
   * puede ser objetivo operativo o kpi 
   */
  public tipo_seccion: string;

  /*
   * Variables para seccion de kpi
   */
  public etads: Array<Catalogo>;
  public formConsulta: FormGroup;
  public bVistaPre: boolean;
  public disabledBtnEdit: boolean;

  //params contiene los datos de busqueda
  public params: any;

  //rows almacena los kpi asignados a las areas
  public rows: Array<PonderacionKpiOperativos> = [];

  //rows_tmp almacenará una copia de los kpis antes de ser modificados
  public rows_tmp: Array<PonderacionKpiOperativos> = [];

  //editar permite habilitar el boton de edicion
  public editar: boolean;

  public soloconsulta: boolean;

  /*
   * Fin variables
   */

  public permission: any = {
    editarMeta: false,
    eliminarMeta: false
  }

  constructor(private auth: AuthService,
    private service: ListaPonderacionService,
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder
  ) { }

  ngOnInit() {
    this.loading = true;
    this.datos_tabla = false;
    this.submitted = false;
    this.disabled = false;
    this.ponderacion_total = 0;
    this.disabledInputText = true;
    this.etads = [];
    this.bVistaPre = false;
    this.disabledBtnEdit = true;
    this.params = {};
    this.soloconsulta = true;

    // this.permission.editarMeta = findRol(3, this.auth.getRolesOee());
    // this.permission.eliminarMeta = findRol(5, this.auth.getRolesOee());

    //Consulta la url para saber el tipo 
    this.route.paramMap.subscribe(params => {
      this.tipo_seccion = params.get('tipo');
      this.service.getInitCatalogos(this.auth.getIdUsuario()).subscribe(result => {
        
        if (result.response.sucessfull) {

          //Acciones para objetivos operativos
          if (this.tipo_seccion == 'objetivo-operativo') {

            let anios_temporal = result.data.listYearsOP || [];

            if (anios_temporal.length > 0) {
              anios_temporal.map(el => {
                this.anios[el.result] = el.result;
              });
            }
            this.anios_con_obj_cargados = anios_temporal.length;
            this.anioSeleccionado = anios_temporal[0].result;


            if (this.anios_con_obj_cargados > 0) {

              this.service.getPonderacion(this.auth.getIdUsuario(), 1, this.anioSeleccionado).subscribe(result => {

                if (result.response.sucessfull) {
                  this.ponderaciones = result.data.listPonderacionObjetivos || [];
                  this.datos_tabla = true;
                  this.disabled = false;
                  this.ponderacion_total = 100;

                  setTimeout(() => {
                    this.ngAfterViewInitHttp();
                    this.status = 'active';
                  }, 200);


                } else {
                  this.disabled = false;
                  Materialize.toast(result.response.message, 4000, 'red');
                }

              }, error => {
                this.disabled = false;
                Materialize.toast('Ocurrió  un error en el servicio!', 4000, 'red');
              });
            }

            // Acciones para KPI
          } else if (this.tipo_seccion == 'kpi-operativo') {
            this.etads = result.data.listEtads || [];
            this.anios = result.data.yearsForKPI || [];
          }

          this.loading = false;
          this.loadFormulario(this.tipo_seccion);

          setTimeout(() => { this.ngAfterViewInitHttp() }, 200);

        } else {

          Materialize.toast(result.response.message, 4000, 'red');
          this.loading = false;
        }
      }, error => {
        Materialize.toast('Ocurrió  un error en el servicio!', 4000, 'red');
        this.loading = false;
      });
    });
  }



  /*
   * Carga plugins despues de cargar y mostrar objetos en el DOM
   */
  ngAfterViewInitHttp(): void {
    $('.tooltipped').tooltip({ delay: 50 });
  }




  agregar() {
    $('.tooltipped').tooltip('hide');
  }

  regresar() {
    $('.tooltipped').tooltip('hide');
  }

  changeIcono(event): void {
    let icono = $(event.target).html();
    $(event.target).html(icono == 'edit' ? 'save' : 'edit');

  }

  changeCombo(): void {

    this.datos_tabla = false;
    this.status = "inactive";
  }

  openModalYear(event): void {
    event.preventDefault();
    swal({
      title: 'Seleccione el año',
      input: 'select',
      cancelButtonText: 'Cancelar',
      confirmButtonText: 'OK',
      inputOptions: this.anios,
      inputPlaceholder: 'SELECCIONE',
      showCancelButton: true,
      inputValidator: (value) => {

        return new Promise((resolve) => {

          this.submitted = false;
          this.status = "inactive";
          this.datos_tabla = false;
          this.disabledInputText = true;

          if (value != "") {
            this.anioSeleccionado = value;
          }

          this.service.getPonderacion(this.auth.getIdUsuario(), 1, this.anioSeleccionado).subscribe(result => {

            if (result.response.sucessfull) {
              this.ponderaciones = result.data.listPonderacionObjetivos || [];
              this.datos_tabla = true;
              this.disabled = false;
              this.ponderacion_total = 100;

              setTimeout(() => {
                this.ngAfterViewInitHttp();
                this.status = 'active';
              }, 200);


            } else {
              this.disabled = false;
              Materialize.toast(result.response.message, 4000, 'red');
            }
          }, error => {
            this.disabled = false;
            Materialize.toast('Ocurrió  un error en el servicio!', 4000, 'red');
          });

          if (value != '') {
            resolve();
            this.anioSeleccionado = value;

          } else {
            resolve('Seleccione un año')
          }
        })
      }
    })
  }

  loadFormulario(tipo_meta_manual: string): void {


    if (this.tipo_seccion == 'kpi-operativo') {
      this.formConsulta = this.fb.group({
        anio: new FormControl({ value: this.params.anio }, [Validators.required]),
        idEtad: new FormControl({ value: this.params.idEtad }, [Validators.required])
      });
    }

  }


  consultaPeriodo(): void {
    this.submitted = true;
    this.status = "inactive";

    this.disabled = true;
    this.datos_tabla = false;

    this.service.getPonderacion(this.auth.getIdUsuario(), this.anioSeleccionado, 1).subscribe(result => {

      if (result.response.sucessfull) {

        this.ponderaciones = result.data.listPonderacionObjetivos || [];
        this.datos_tabla = true;
        this.disabled = false;

        setTimeout(() => {
          this.ngAfterViewInitHttp();
          this.status = 'active';
        }, 200);


      } else {
        this.disabled = false;
        Materialize.toast(result.response.message, 4000, 'red');
      }
    }, error => {
      this.disabled = false;
      Materialize.toast('Ocurrió  un error en el servicio!', 4000, 'red');
    });

  }

  openModalConfirmacion(accion: string, event?: any): void {
    this.mensajeModal = '';
    let detalle = '';
    let tipo_meta = -1;

    if (this.tipo_seccion == 'objetivo-operativo') {
      detalle = ' Año : <b>' + this.anioSeleccionado + ' </b>';
      tipo_meta = 1;
    } else if (this.tipo_seccion == 'kpi-operativo') {
      detalle = ' Año: <b>' + this.params.anio + '</b> Area Etad: <b>' + this.getDescriptivoArea(this.params.idEtad) + '</b>';
      tipo_meta = 2;
    }

    switch (accion) {
      case 'update':
        this.mensajeModal = '¿Está seguro de actualizar las ponderaciones? ';
        break;
    }

    /* 
     * Configuración del modal de confirmación
     */
    swal({
      title: '<span style="color: #303f9f ">' + this.mensajeModal + '</span>',
      type: 'question',
      html: '<p style="color: #303f9f ">' + detalle + '</p>',
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
          case 'update':
            /* 
                * Se forma el modelo a enviar al backend
                * contenedor.ponderaciones Es una variable que se necesita por el backend
                */
            let contenedor: any = { ponderaciones: {} };

            if (tipo_meta == 1) {
              contenedor.ponderaciones = this.ponderaciones;
              this.service.updatePonderacion(this.auth.getIdUsuario(), tipo_meta, contenedor).subscribe(result => {
                if (result.response.sucessfull) {
                  this.disabledInputText = !this.disabledInputText;
                  Materialize.toast('Se actualizarón correctamente ', 4000, 'green');
                } else {

                  Materialize.toast(result.response.message, 4000, 'red');
                }
              }, error => {
                Materialize.toast('Ocurrió  un error en el servicio!', 4000, 'red');
              });
            } else if (tipo_meta == 2) {
              //setea un valor vacio o indefinido a 0. Evita error en el backend 
              this.rows.map(el => {
                if (Number.isNaN(parseInt("" + el.ponderacion)) || el.ponderacion == undefined) {
                  el.ponderacion = 0;
                }
              });
              // Solo envia los kpi
              contenedor.ponderaciones = this.rows.filter(el => el.padre == 1);
              this.service.updatePonderacion(this.auth.getIdUsuario(), tipo_meta, contenedor).subscribe(result => {
                if (result.response.sucessfull) {
                  Materialize.toast('Se actualizarón correctamente', 4000, 'green');
                  this.disabledInputText = !this.disabledInputText;

                } else {
                  Materialize.toast(result.response.message, 4000, 'red');
                }
              }, eror => {
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

  }

  onlyNumber(event: any): boolean {
    let charCode = (event.which) ? event.which : event.keyCode;
    if (charCode < 48 || charCode > 57) {
      return false;
    }
  }

  somethingChanged(ponderacion: any): void {
    this.ponderacion_total = 0;
    let valores_ponderacion = this.ponderaciones.map(el => parseInt("" + el.ponderacion));

    this.ponderacion_total = valores_ponderacion.reduce((valor_anterior, valor_actual) => {

      if (Number.isNaN(valor_anterior) || typeof valor_anterior == undefined) valor_anterior = 0;
      if (Number.isNaN(valor_actual) || typeof valor_actual == undefined) valor_actual = 0;
      return valor_anterior + valor_actual;
    });

    // this.disabledBtn = !(this.ponderacion_total == 100);
  }

  modificaValores(accion: string, tipo: string): void {

    if (tipo == 'objetivo-operativo') {
      if (accion == 'editar') {
        this.ponderaciones_tmp = clone(this.ponderaciones);
      } else if (accion == 'cancelar') {
        this.ponderaciones = this.ponderaciones_tmp;
        this.ponderacion_total = 100;
      }
    } else if (tipo == 'kpi-operativo') {

      if (accion == 'editar') {
        this.rows_tmp = clone(this.rows);
      } else if (accion == 'cancelar') {
        this.rows = this.rows_tmp;
        this.ponderacion_total = 100;
      }
    }

    this.disabledInputText = !this.disabledInputText;
  }

  changeComboKPI(tipo_combo: string): void {
    this.bVistaPre = false;
    this.disabledBtnEdit = true;
    this.soloconsulta = true;
    this.disabledInputText = true;
  }

  help(event): void {
    $('.tooltipped').tooltip('hide');
    event.preventDefault();
    swal({
      title: 'Ayuda',
      type: 'info',
      html: ' <b> Para modificar ponderaciones </b> seleccione el año, el area y haga clic en buscar <br>' +
        ' Recuerde que <b>la suma de todos los KPI\'s debe ser igual a 100 </b> ',
      showCloseButton: false,
      showCancelButton: false,
      focusConfirm: false,
      confirmButtonText: 'Ok!'
    })
  }

  consultaKpi(): void {
    this.ponderacion_total = 0;
    this.submitted = true;
    this.mensajeModal = '';
    this.bVistaPre = false;

    if (this.formConsulta.valid) {
      this.service.getPonderacion(this.auth.getIdUsuario(), 2, this.params.anio, this.params.idEtad).subscribe(result => {

        if (result.response.sucessfull) {
          this.rows = result.data.listData || [];
          this.ponderacion_total = 100;

          if (this.rows.length > 0) {
            //objetivo_operativo permite controlar que kpi coresponde al objetivo operativo
            let objetivo_operativo = 0;
            // el siguiente ciclo permite agrupar el objetivo operativo y sus kpi mediante la varible control
            let tmp_ponderaciones = this.rows.filter(el => {
              if (el.padre == 0) objetivo_operativo++;
              el.control = objetivo_operativo;
              el.suma_ok = true;
              return el.padre == 1;
            }).map(el => el.ponderacion);

            this.ponderacion_total = tmp_ponderaciones.reduce((anterior, actual) => {
              if (!isNumeroAsignacionValid("" + anterior)) anterior = 0;
              if (!isNumeroAsignacionValid("" + actual)) actual = 0;
              return anterior + actual;
            });

            if (this.ponderacion_total == 0) {
              this.soloconsulta = false;
            }

            this.disabledBtnEdit = (this.ponderacion_total == 100);

          } else {
            this.soloconsulta = false;
          }

          this.bVistaPre = true;
        } else {
          Materialize.toast(result.response.message, 4000, 'red');
        }
      }, eror => {
        Materialize.toast('Ocurrió un error en el servicio!', 4000, 'red');
      });

    } else {
      Materialize.toast('Verifique los datos capturados!', 4000, 'red');
    }
  }

  somethingChangedKPI(ponderacion: any, control: number): void {
    let kpis_por_objetivo = this.rows.filter(el => el.control == control);

    let ponderacion_por_kpi = kpis_por_objetivo.filter(el => el.padre == 1).map(el => parseInt("" + el.ponderacion));

    this.ponderacion_total = 0;
    this.ponderacion_total = this.rows.filter(el => el.padre == 1).map(el => parseInt("" + el.ponderacion)).reduce((valor_anterior, valor_actual) => {
      if (Number.isNaN(valor_anterior) || typeof valor_anterior == undefined) valor_anterior = 0;
      if (Number.isNaN(valor_actual) || typeof valor_actual == undefined) valor_actual = 0;
      return valor_anterior + valor_actual;
    });

    let total_kpi = ponderacion_por_kpi.reduce((valor_anterior, valor_actual) => {

      if (Number.isNaN(valor_anterior) || typeof valor_anterior == undefined) valor_anterior = 0;
      if (Number.isNaN(valor_actual) || typeof valor_actual == undefined) valor_actual = 0;
      return valor_anterior + valor_actual;

    });

    let el = this.rows.filter(el => el.padre == 0 && el.control == control)[0];

    el.suma_ok = (total_kpi == el.ponderacion);

    this.disabledBtnEdit = (this.rows.filter(el => el.padre == 0).map(el => el.suma_ok).reduce((anterior, actual) => {
      return anterior && actual;
    }));

  }

  getDescriptivoArea(idAreaEtad: number): string {
    let el = this.etads.filter(el => el.id == idAreaEtad);
    if (el.length > 0) {
      return el[0].valor;
    } else {
      return "No identificada";
    }
  }

}
