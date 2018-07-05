import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../../auth/auth.service';
import { Meta } from '../../models/meta';
import { deleteItemArray, getAnioActual, calculaDiaPorMes, isNumeroAsignacionValid, findRol, clone } from '../../utils';
import swal from 'sweetalert2';
import { ListaPonderacionService } from './lista-ponderacion.service';
import { Periodo } from '../../models/periodo';
import { Linea } from '../../models/linea';
import { Catalogo } from '../../models/catalogo';
import { PetPonderacionObjetivoOperativo } from '../../models/pet-ponderacion-objetivo-operativo';
import {
  trigger,
  state,
  style,
  animate,
  transition
} from '@angular/animations';


declare var $: any;
declare var Materialize: any;
@Component({
  selector: 'app-lista-ponderacion',
  templateUrl: './lista-ponderacion.component.html',
  providers: [ListaPonderacionService],
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

  public permission: any = {
    editarMeta: false,
    eliminarMeta: false
  }

  constructor(private auth: AuthService,
    private service: ListaPonderacionService,
    private fb: FormBuilder
  ) { }

  ngOnInit() {
    this.loading = true;
    this.datos_tabla = false;
    this.submitted = false;
    this.disabled = false;
    this.ponderacion_total = 0;
    this.disabledInputText = true;


    // this.permission.editarMeta = findRol(3, this.auth.getRolesOee());
    // this.permission.eliminarMeta = findRol(5, this.auth.getRolesOee());

    this.service.getInitCatalogos(this.auth.getIdUsuario()).subscribe(result => {
      console.log('init', result)
      if (result.response.sucessfull) {
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
            console.log('rrrrr', result)
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


        this.loading = false;
        this.loadFormulario();
        setTimeout(() => { this.ngAfterViewInitHttp() }, 200)
      } else {
        Materialize.toast(result.response.message, 4000, 'red');
        this.loading = false;
      }
    }, error => {
      Materialize.toast('Ocurrió  un error en el servicio!', 4000, 'red');
      this.loading = false;
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
            console.log('rrrrr', result)
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

  loadFormulario(): void {
    // this.formConsultaPeriodo = this.fb.group({
    //   idLinea: new FormControl({ value: this.idLinea }, [Validators.required]),
    //   idPeriodo: new FormControl({ value: this.idPeriodo }, [Validators.required])
    // });
  }


  consultaPeriodo(): void {
    this.submitted = true;
    this.status = "inactive";

    // if (this.formConsultaPeriodo.valid) {
    this.disabled = true;
    this.datos_tabla = false;

    this.service.getPonderacion(this.auth.getIdUsuario(), this.anioSeleccionado, 1).subscribe(result => {
      console.log('result de ponderaciones', result)
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

    // } else {
    //   Materialize.toast('Verifique los datos capturados!', 4000, 'red');
    // }



  }

  openModalConfirmacion(accion: string, event?: any): void {
    this.mensajeModal = '';

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
      html: '<p style="color: #303f9f "> Año : <b>' + this.anioSeleccionado + ' </b> </p>',
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
            contenedor.ponderaciones = this.ponderaciones;
            this.service.updatePonderacion(this.auth.getIdUsuario(), 1, contenedor).subscribe(result => {
              if (result.response.sucessfull) {
                this.disabledInputText = !this.disabledInputText;
                Materialize.toast('Se actualizarón correctamente ', 4000, 'green');
              } else {

                Materialize.toast(result.response.message, 4000, 'red');
              }
            }, error => {
              Materialize.toast('Ocurrió  un error en el servicio!', 4000, 'red');
            });
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

  modificaValores(accion: string): void {

    if (accion == 'editar') {
      this.ponderaciones_tmp = clone(this.ponderaciones);
    } else if (accion == 'cancelar') {
      this.ponderaciones = this.ponderaciones_tmp;
      this.ponderacion_total = 100;
    }

    this.disabledInputText = !this.disabledInputText;
  }

}
