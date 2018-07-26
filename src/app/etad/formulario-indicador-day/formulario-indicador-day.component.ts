import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../../auth/auth.service';
import {
  deleteItemArray,
  getAnioActual,
  calculaDiaPorMes,
  isNumeroAsignacionValid,
  isValidId,
  findRol,
  clone,
  getFechaActual
} from '../../utils';
import swal from 'sweetalert2';
import { FormularioIndicadorDayService } from './formulario-indicador-day.service';
import { Periodo } from '../../models/periodo';
import { PetMetaKpi } from '../../models/pet-meta-kpi';
import { Catalogo } from '../../models/catalogo';
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
  selector: 'app-formulario-indicador-day',
  templateUrl: './formulario-indicador-day.component.html',
  providers: [FormularioIndicadorDayService],
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
export class FormularioIndicadorDayComponent implements OnInit {

  public loading: boolean;
  public datos_tabla: boolean;
  public mensajeModal: string;
  public estatusPeriodo: number;
  public submitted: boolean;
  public disabled: boolean;
  public etads: Array<Catalogo> = [];
  public grupos: Array<Catalogo> = [];
  public formConsultaPeriodo: FormGroup;
  public status: string;
  public idEtad: number;
  public idGrupo: number;
  public dia: string;
  public kpis: Array<any>;
  public disabledInputText: boolean;
  public fecha_sistema: string;

  /*
   * Variables para el calculo de ausentismo
   */
  public plantilla: any;
  public faltas: any;
  public porcentaje: any;
  public id_meta_kpi_tmp: any;
  /*
   * Fin variables para calculo de ausentismo
   */

  public no_permiso_edicion: boolean;
  public isFacilitadorAmut: boolean;

  constructor(private auth: AuthService,
    private service: FormularioIndicadorDayService,
    private fb: FormBuilder
  ) { }

  ngOnInit() {
    this.loading = true;
    this.datos_tabla = false;
    this.submitted = false;
    this.disabled = false;
    this.disabledInputText = false;
    this.dia = "";
    this.plantilla = 0;
    this.faltas = 0;
    this.porcentaje = 0;
    this.id_meta_kpi_tmp = -1;
    this.no_permiso_edicion = (!this.auth.permissionEdit(6) || !this.auth.permissionEdit(5) || !this.auth.permissionEdit(4));
    this.estatusPeriodo = 0;


    this.service.getCatalogos(this.auth.getIdUsuario()).subscribe(result => {

      if (result.response.sucessfull) {

        this.etads = result.data.listEtads || [];
        this.grupos = result.data.listGrupos || [];
        this.dia = result.data.dia_string || getFechaActual();

        this.grupos = this.grupos.filter(el => el.id != 6 && el.id != 5);

        if (this.no_permiso_edicion) {
          this.idGrupo = this.auth.getId_Grupo();
          this.idEtad = this.auth.getIdEtad();

          this.isFacilitadorAmut =  (!this.auth.permissionEdit(4) && (this.idEtad == 1 || this.idEtad == 2));
          
          if(this.isFacilitadorAmut){
            this.etads = this.etads.filter(el=>el.id == 1 || el.id == 2);
          }
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

    let calendario = $('#dia').pickadate({
      selectMonths: true, // Creates a dropdown to control month
      selectYears: 15, // Creates a dropdown of 15 years to control year,
      today: '',
      clear: 'Limpiar',
      close: 'OK',
      monthsFull: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
      monthsShort: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
      weekdaysShort: ['Dom', 'Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab'],
      weekdaysLetter: ['D', 'L', 'M', 'M', 'J', 'V', 'S'],
      format: 'dd/mm/yyyy',
      closeOnSelect: false, // Close upon selecting a date,
      onClose: () => {
        this.dia = $('#dia').val();
      }
      // onStart: function (context) {
      //   console.log('fecha sistema dia context', context)
      //   this.set('select', this.dia)
      // }
    });


    Materialize.updateTextFields();

    $('#modalEdicion').modal({
      opacity: 0.6,
      inDuration: 500,
      dismissible: false,
      complete: () => { }
    });

  }

  agregar() {
    $('.tooltipped').tooltip('hide');
  }

  regresar() {
    $('.tooltipped').tooltip('hide');
  }



  changeCombo(): void {
    this.estatusPeriodo = 0;
    this.datos_tabla = false;
    this.disabledInputText = false;
    this.status = "inactive";
  }


  loadFormulario(): void {
    this.formConsultaPeriodo = this.fb.group({
      idEtad: new FormControl({ value: this.idEtad, disabled: (this.no_permiso_edicion && !this.isFacilitadorAmut )}, [Validators.required]),
      idGrupo: new FormControl({ value: this.idGrupo, disabled: this.no_permiso_edicion }, [Validators.required]),
      dia: new FormControl({ value: this.dia, disabled: this.no_permiso_edicion }, [Validators.required])
    });
  }


  consultaPeriodo(event): void {
    this.estatusPeriodo = 0;
    this.disabledInputText = false;
    this.submitted = true;
    this.status = "inactive";

    if (this.formConsultaPeriodo.valid || this.no_permiso_edicion ) {
      this.disabled = true;
      this.datos_tabla = false;

      this.service.viewKpiForSave(this.auth.getIdUsuario(), this.idEtad, this.dia).subscribe(result => {

        if (result.response.sucessfull) {

          this.kpis = result.data.listIndicadorDiarios || [];
          this.datos_tabla = true;
          this.disabled = false;

          if (this.kpis.length > 0) {
            this.estatusPeriodo = this.kpis[0].periodo.estatus;
          }

          setTimeout(() => {

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

    } else {
      Materialize.toast('Verifique los datos capturados!', 4000, 'red');
    }

  }

  openModalConfirmacion(accion: string, event?: any): void {
    this.mensajeModal = '';

    switch (accion) {
      case 'add':
        this.mensajeModal = '¿Está seguro de cargar indicadores? ';
        break;
    }

    if (this.isValidMetas(this.kpis) == 0) {

      /* 
       * Configuración del modal de confirmación
       */
      swal({
        title: '<span style="color: #303f9f ">' + this.mensajeModal + '</span>',
        type: 'question',
        html: '<p style="color: #303f9f "> Area Etad : <b>' + this.getDescriptivo(this.etads, this.idEtad) + ' </b> Grupo: <b>' + this.getDescriptivo(this.grupos, this.idGrupo) + '</b> Dia: <b>' + this.dia + '</b></p>',
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
            case 'add':
              /* 
              * Se forma el modelo a enviar al backend
              * contenedor.ponderaciones Es una variable que se necesita por el backend
              */
              let contenedor: any = { indicadores: {} };
              this.kpis.map(el => {
                if (Number.isNaN(parseInt("" + el.valor)) || el.valor == undefined) {
                  el.valor = 0;
                }
                el.id_grupo = this.idGrupo;
              });

              contenedor.indicadores = this.kpis;

              this.service.insertIndicadores(this.auth.getIdUsuario(), this.idEtad, contenedor, this.dia).subscribe(result => {

                if (result.response.sucessfull) {
                  this.disabledInputText = true;
                  Materialize.toast(' Se agregarón correctamente ', 4000, 'green');
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
    } else {

      Materialize.toast('Verifique los datos marcados en rojo!', 4000, 'red');

    }

  }

  getDescriptivo(catalogo: Array<Catalogo>, id: number): string {

    let el = catalogo.filter(el => el.id == id);

    if (el.length > 0) {
      return el[0].valor;
    } else {
      return "No identificado";
    }

  }

  isValidMetas(metas_kpis: Array<PetMetaKpi>): number {
    let numero_error = 0;

    metas_kpis.map(el => {
      if (!isNumeroAsignacionValid("" + el.valor)) {
        numero_error++;
        el.class_input = 'error';
      } else {
        el.class_input = '';
      }
    });

    return numero_error;

  }

  calcularAusentismo(id_meta_kpi: number, name_kpi: string) {
    this.plantilla = 0;
    this.faltas = 0;
    this.porcentaje = "";
    this.id_meta_kpi_tmp = id_meta_kpi;
    let modal = $('#modalEdicion');
    modal.find('#titulo').html(name_kpi);
    modal.modal('open');
  }

  asignarPorcentaje(): void {
    this.kpis.filter(el => el.id_meta_kpi == this.id_meta_kpi_tmp)[0].valor = this.porcentaje;
    $('#modalEdicion').modal('close');
  }

  onlyNumber(event: any): boolean {
    let charCode = (event.which) ? event.which : event.keyCode;
    if (charCode < 48 || charCode > 57) {
      return false;
    }

  }

  calcular(): void {
    if (Number.isNaN(parseInt("" + this.faltas)) || this.faltas == undefined) {
      this.faltas = 0;
    }

    if (Number.isNaN(parseInt("" + this.plantilla)) || this.plantilla == undefined) {
      this.plantilla = 0;
    }

    this.plantilla = parseInt(this.plantilla);
    this.faltas = parseInt(this.faltas);

    if (this.plantilla == 0 && this.faltas == 0) {
      this.porcentaje = "";
    } else if (this.faltas > this.plantilla) {
      this.porcentaje = ""
    } else {
      this.porcentaje = (this.faltas / this.plantilla).toFixed(3);
    }

  }

}
