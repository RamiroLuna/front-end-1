import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../../auth/auth.service';
import {
  deleteItemArray,
  getAnioActual,
  calculaDiaPorMes,
  isNumeroAsignacionValid,
  findRol,
  clone,
  getFechaActual
} from '../../utils';
import swal from 'sweetalert2';
import { FormularioIndicadorMothService } from './formulario-indicador-moth.service';
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
  selector: 'app-formulario-indicador-moth',
  templateUrl: './formulario-indicador-moth.component.html',
  providers: [FormularioIndicadorMothService],
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
export class FormularioIndicadorMothComponent implements OnInit {

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

  public kpis: Array<any>;
  public disabledInputText: boolean;

  public anioSeleccionado: number;
  public periodos: Array<Periodo> = [];
  public anios: any = {};
  public meses: Array<any> = [];
  public idPeriodo: number;
  public idGrupo:number;

  constructor(private auth: AuthService,
    private service: FormularioIndicadorMothService,
    private fb: FormBuilder
  ) { }

  ngOnInit() {
    this.loading = true;
    this.datos_tabla = false;
    this.submitted = false;
    this.disabled = false;
    this.disabledInputText = false;
    this.anioSeleccionado = getAnioActual();

    this.estatusPeriodo = 0;


    this.service.getCatalogos(this.auth.getIdUsuario()).subscribe(result => {
    
      if (result.response.sucessfull) {

        this.etads = result.data.listEtads || [];
        this.periodos = result.data.listPeriodos || [];
        this.grupos = result.data.listGrupos || [];
        this.grupos = this.grupos.filter(el=> el.id != 6 && el.id != 5);


        let tmpAnios = this.periodos.map(el => el.anio);
        this.periodos.filter((el, index) => {
          return tmpAnios.indexOf(el.anio) === index;
        }).forEach((el) => {
          let tmp = el.anio;
          this.anios[tmp] = tmp;
        });

        this.meses = this.periodos.filter(el => el.anio == this.anioSeleccionado);

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



  changeCombo(): void {
    this.estatusPeriodo = 0;
    this.datos_tabla = false;
    this.disabledInputText = false;
    this.status = "inactive";
  }


  loadFormulario(): void {
    this.formConsultaPeriodo = this.fb.group({
      idEtad: new FormControl({ value: this.idEtad }, [Validators.required]),
      idPeriodo: new FormControl({ value: this.idPeriodo }, [Validators.required]),
      idGrupo: new FormControl({ value: this.idGrupo }, [Validators.required])
    });
  }


  consultaPeriodo(): void {
    this.disabledInputText = false;
    this.submitted = true;
    this.status = "inactive";


    if (this.formConsultaPeriodo.valid) {
      this.disabled = true;
      this.datos_tabla = false;

      this.service.viewKpiForSave(this.auth.getIdUsuario(), this.idEtad, this.idPeriodo).subscribe(result => {
       
        if (result.response.sucessfull) {

          this.kpis = result.data.listIndicadorMensuales || [];
          this.disabled = false;
          if(this.kpis.length > 0 ){
            this.estatusPeriodo = this.kpis[0].metaKpi.periodo.estatus;
          }

          this.datos_tabla = true;

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
        this.mensajeModal = '¿Está seguro de cargar indicadores mensuales? ';
        break;
    }

    if (this.isValidMetas(this.kpis) == 0) {

      /* 
       * Configuración del modal de confirmación
       */
      swal({
        title: '<span style="color: #303f9f ">' + this.mensajeModal + '</span>',
        type: 'question',
        html: '<p style="color: #303f9f "> Area Etad : <b>' + this.getDescriptivo(this.etads, this.idEtad) + '</b> Periodo: <b> '+ this.getDescriptivoPeriodo(this.idPeriodo) + ' ' + this.anioSeleccionado +'</b></p>',
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
                el.id_periodo = this.idPeriodo;
              });

              contenedor.indicadores = this.kpis;

              this.service.insertIndicadores(this.auth.getIdUsuario(), this.idEtad, contenedor).subscribe(result => {
               
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
          this.formConsultaPeriodo.reset();
          this.submitted = false;
          this.status = "inactive";
          this.datos_tabla = false;


          if (value != '') {
            resolve();
            this.anioSeleccionado = value;
            this.meses = this.periodos.filter(el => el.anio == this.anioSeleccionado);
          } else {
            resolve('Seleccione un año')
          }
        })
      }
    })
  }

  getDescriptivoPeriodo(idPeriodo:number):string{
    let el = this.periodos.filter(el=>el.id_periodo == idPeriodo);

    if(el.length > 0){
      return el[0].descripcion_mes;
    }
    else{
      return " Mes no identificado ";
    }
  }

}
