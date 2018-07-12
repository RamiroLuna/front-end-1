import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../../auth/auth.service';
import {
  deleteItemArray,
  getAnioActual,
  calculaDiaPorMes,
  isNumeroAsignacionValid,
  findRol,
  clone
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
  // // public estatusPeriodo: boolean;
  public submitted: boolean;
  public disabled: boolean;
  public etads: Array<Catalogo> = [];
  public grupos: Array<Catalogo> = [];
  public formConsultaPeriodo: FormGroup;
  public status: string;
  public idEtad: number;
  public idGrupo: number;
  public dia:string;

  constructor(private auth: AuthService,
    private service: FormularioIndicadorDayService,
    private fb: FormBuilder
  ) { }

  ngOnInit() {
    this.loading = true;
    this.datos_tabla = false;
    this.submitted = false;
    this.disabled = false;
    // // this.estatusPeriodo = true;


    this.service.getCatalogos(this.auth.getIdUsuario()).subscribe(result => {
      console.log('get catalogos ', result)
      if (result.response.sucessfull) {

        this.etads = result.data.listEtads || [];
        this.grupos = result.data.listGrupos || [];

        this.grupos = this.grupos.filter(el=> el.id != 6 && el.id != 5);

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
    // this.estatusPeriodo = true;
    this.datos_tabla = false;
    this.status = "inactive";
  }


  loadFormulario(): void {
    this.formConsultaPeriodo = this.fb.group({
      idEtad: new FormControl({ value: this.idEtad }, [Validators.required]),
      idGrupo: new FormControl({ value: this.idGrupo }, [Validators.required]),
      dia: new FormControl({ value: this.dia}, [Validators.required]),
    });
  }


  consultaPeriodo(): void {
    this.submitted = true;
    this.status = "inactive";
  

    if (this.formConsultaPeriodo.valid) {
      this.disabled = true;
      this.datos_tabla = false;

      this.service.viewKpiForSave(this.auth.getIdUsuario(), this.idEtad , "").subscribe(result => {

        if (result.response.sucessfull) {
          // // this.estatusPeriodo = result.data.estatusPeriodo;
        

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

    } else {
      Materialize.toast('Verifique los datos capturados!', 4000, 'red');
    }

  }

  // openModalConfirmacion(accion: string, event?: any): void {
  //   this.mensajeModal = '';

  //   switch (accion) {
  //     case 'update':
  //       this.mensajeModal = '¿Está seguro de agregar metas? ';
  //       break;
  //   }

  //   if (this.isValidMetas(this.kpis) == 0) {

  //     /* 
  //      * Configuración del modal de confirmación
  //      */
  //     swal({
  //       title: '<span style="color: #303f9f ">' + this.mensajeModal + '</span>',
  //       type: 'question',
  //       // html: '<p style="color: #303f9f "> Area Etad : <b>' + this.getDescriptivoArea(this.idEtad) + ' </b> Año: <b>' + this.anioSeleccionado + '</b></p>',
  //       showCancelButton: true,
  //       confirmButtonColor: '#303f9f',
  //       cancelButtonColor: '#9fa8da ',
  //       cancelButtonText: 'Cancelar',
  //       confirmButtonText: 'Si!',
  //       allowOutsideClick: false,
  //       allowEnterKey: false
  //     }).then((result) => {
  //       /*
  //        * Si acepta
  //        */
  //       if (result.value) {
  //         switch (accion) {
  //           case 'update':
  //             /* 
  //             * Se forma el modelo a enviar al backend
  //             * contenedor.ponderaciones Es una variable que se necesita por el backend
  //             */
  //             let contenedor: any = { metas: {} };
  //             this.kpis.map(el => {
  //               if (Number.isNaN(parseInt("" + el.valor)) || el.valor == undefined) {
  //                 el.valor = 0;
  //               }
  //             });
  //             contenedor.metas = this.kpis;

  //             // this.service.updateMeta(this.auth.getIdUsuario(), contenedor).subscribe(result => {

  //             //   if (result.response.sucessfull) {

  //             //     this.bandera = false;
  //             //     this.disabledInputText = true;

  //             //     Materialize.toast('Metas modificadas correctamente ', 4000, 'green');
  //             //   } else {

  //             //     Materialize.toast(result.response.message, 4000, 'red');
  //             //   }
  //             // }, error => {
  //             //   Materialize.toast('Ocurrió  un error en el servicio!', 4000, 'red');
  //             // });
  //             break;
  //         }
  //         /*
  //         * Si cancela accion
  //         */
  //       } else if (result.dismiss === swal.DismissReason.cancel) {
  //       }
  //     })
  //   } else {

  //     Materialize.toast('Verifique los datos marcados en rojo!', 4000, 'red');

  //   }

  // }

  getDescriptivoArea(idEtad): string {

    let el = this.etads.filter(el => el.id == idEtad);

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

  // modificaValores(accion: string): void {

  //     if (accion == 'editar') {

  //       this.kpis_tmp = clone(this.kpis);

  //     } else if (accion == 'cancelar') {
  //       this.kpis = this.kpis_tmp;

  //     }
    
  //   this.disabledInputText = !this.disabledInputText;
  // }


}
