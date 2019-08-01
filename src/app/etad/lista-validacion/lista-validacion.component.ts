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
import { ListaValidacionService } from './lista-validacion.service';
import { Periodo } from '../../models/periodo';
import { Catalogo } from '../../models/catalogo';
import {
  trigger,
  state,
  style,
  animate,
  transition
} from '@angular/animations';
import { PetMetaKpi } from '../../models/pet-meta-kpi';


declare var $: any;
declare var Materialize: any;

@Component({
  selector: 'app-lista-validacion',
  templateUrl: './lista-validacion.component.html',
  styleUrls: [ 'lista-validacion.component.css' ],
  providers: [ ListaValidacionService ],
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
export class ListaValidacionComponent implements OnInit {

  public loading: boolean;
  public datos_tabla: boolean;
  public mensajeModal: string;
  public estatusPeriodo: number;

  public anioSeleccionado: number;
  public submitted: boolean;
  public disabled: boolean;
  public periodos: Array<Periodo> = [];
  public etads: Array<Catalogo> = [];
  public grupos: Array<Catalogo> = [];
  public anios: any = {};
  public meses: Array<any> = [];
  public registros: Array<any>;
  public formConsultaPeriodo: FormGroup;
  public status: string;
  public idEtad: number;
  public idPeriodo: number;
  public idGrupo: number;
  public texto_busqueda: string = "";
  public kpis: Array<any>;

  /*
   * Variables para modal
   */
  public dia_consulta: string;
  public area_consulta: string;
  public grupo_consulta: string;



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
  public isMantenimiento: boolean;

  public permission: any = {
    validar: false,
    quitar_validacion: false
  }

  constructor(private auth: AuthService,
    private service: ListaValidacionService,
    private fb: FormBuilder
  ) { }

  ngOnInit() {

    this.loading = true;
    this.datos_tabla = false;
    this.submitted = false;
    this.disabled = false;
    this.kpis = [];


    this.plantilla = 0;
    this.faltas = 0;
    this.porcentaje = 0;
    this.id_meta_kpi_tmp = -1;

    this.estatusPeriodo = 0;
    this.anioSeleccionado = getAnioActual();

    this.no_permiso_edicion = !(!this.auth.permissionEdit(3) || !this.auth.permissionEdit(2) || !this.auth.permissionEdit(1));

    this.permission.validar = findRol(49, this.auth.getRolesEtad());   
    this.permission.quitar_validacion = findRol(51, this.auth.getRolesEtad());   

    this.service.getInitCatalogos(this.auth.getIdUsuario()).subscribe(result => {

      if (result.response.sucessfull) {
        this.grupos = result.data.listGrupos || [];
        this.grupos = this.grupos.filter(el=>el.id != 6);
        this.etads = result.data.listEtads || [];
        this.periodos = result.data.listPeriodos || [];
        let tmpAnios = this.periodos.map(el => el.anio);
        this.periodos.filter((el, index) => {
          return tmpAnios.indexOf(el.anio) === index;
        }).forEach((el) => {
          let tmp = el.anio;
          this.anios[tmp] = tmp;
        });

        this.meses = this.periodos.filter(el => el.anio == this.anioSeleccionado);

        if (this.no_permiso_edicion) {
          this.idGrupo = this.auth.getId_Grupo();
          this.idEtad = this.auth.getIdEtad();

          this.isFacilitadorAmut =  (!this.auth.permissionEdit(4) && (this.idEtad == 1 || this.idEtad == 2));
          this.isMantenimiento =  (!this.auth.permissionEdit(4) && (this.idEtad == 5 || this.idEtad == 2010));
          
          if(this.isFacilitadorAmut){
            this.etads = this.etads.filter(el=>el.id == 1 || el.id == 2);
          }
          
          if(this.isMantenimiento){
            this.etads = this.etads.filter(el=>el.id == 5 || el.id == 2010);
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

    $('#modalEdicion').modal({
      opacity: 0.6,
      inDuration: 500,
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
         
          this.formConsultaPeriodo.controls.idPeriodo.reset();

          if (!this.no_permiso_edicion) {
            this.formConsultaPeriodo.controls.idEtad.reset();

            if (!this.isFacilitadorAmut) {
              this.formConsultaPeriodo.controls.idGrupo.reset();
            }

            if (!this.isMantenimiento) {
              this.formConsultaPeriodo.controls.idGrupo.reset();
            }
          }

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

  loadFormulario(): void {
    this.formConsultaPeriodo = this.fb.group({
      idEtad: new FormControl({ value: this.idEtad ,  disabled:  (this.no_permiso_edicion && !this.isFacilitadorAmut && !this.isMantenimiento) }, [Validators.required]),
      idPeriodo: new FormControl({ value: this.idPeriodo }, [Validators.required]),
      idGrupo: new FormControl({ value: this.idGrupo , disabled:  this.no_permiso_edicion && this.idGrupo != 6 && this.idGrupo != 5 }, [Validators.required])
    });
  }


  consultaPeriodo(): void {
    this.submitted = true;
    this.status = "inactive";
    this.estatusPeriodo = 0;

    if (this.formConsultaPeriodo.valid) {
      this.disabled = true;
      this.datos_tabla = false;

      this.service.getAllIndicadores(this.auth.getIdUsuario(), this.idPeriodo, this.idEtad, this.idGrupo).subscribe(result => {

        if (result.response.sucessfull) {
      
          this.registros = result.data.listIndicadorDiarios || [];
        
          this.disabled = false;

          if(this.registros.length > 0 ){
            this.estatusPeriodo = this.registros[0].periodo.estatus;
          }

          this.datos_tabla = true;

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

  limpiarInput() {
    this.texto_busqueda = "";
  }

  consultaById(dia: string, id_grupo: number, grupo_descripcion: string): void {

    this.dia_consulta = "";
    this.area_consulta = "";
    this.grupo_consulta = "";
    this.kpis = [];

    this.service.getDetailIndicadores(this.auth.getIdUsuario(), id_grupo, this.idEtad, dia).subscribe(result => {

      if (result.response.sucessfull) {
        this.kpis = result.data.listIndicadorDiarios || [];
        setTimeout(() => {
          this.dia_consulta = dia;
          this.area_consulta = this.getDescriptivo(this.etads, this.idEtad);
          this.grupo_consulta = grupo_descripcion;
          $('#modalEdicion').modal('open');
        }, 10);
      } else {

        Materialize.toast(result.response.message, 4000, 'red');
      }
    }, error => {

      Materialize.toast('Ocurrió  un error en el servicio!', 4000, 'red');
    });

  }

  getDescriptivo(catalogo: Array<Catalogo>, id: number): string {

    let el = catalogo.filter(el => el.id == id);

    if (el.length > 0) {
      return el[0].valor;
    } else {
      return "No identificado";
    }

  }

  openModalConfirmacion(accion: string, dia:string, id_grupo:number, grupo_descripcion:string,  index:number,event?: any): void {
   
    this.mensajeModal = '';

    switch (accion) {
      case 'validar':
        this.mensajeModal = '¿Está seguro de validar los indicadores registrados? ';
        break;
      case 'invalidar':
        this.mensajeModal = '¿Está seguro de quitar la validación de los indicadores? ';
        break;
    }

    if (this.isValidMetas(this.kpis) == 0) {

      /* 
       * Configuración del modal de confirmación
       */
      swal({
        title: '<span style="color: #303f9f ">' + this.mensajeModal + '</span>',
        type: 'question',
        html: '<p style="color: #303f9f "> Area Etad : <b>' + this.getDescriptivo(this.etads, this.idEtad) + ' </b> Grupo: <b>' + grupo_descripcion + '</b> Dia: <b>' + dia + '</b></p>',
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
            case 'validar':
              this.service.validateIndicadores(this.auth.getIdUsuario(), id_grupo, this.idEtad , dia).subscribe(result => {
              
                if (result.response.sucessfull) {
                  this.registros[index].estatus = 1;
                  Materialize.toast(' Se validó correctamente ', 4000, 'green');
                } else {

                  Materialize.toast(result.response.message, 4000, 'red');
                }
              }, error => {
                Materialize.toast('Ocurrió  un error en el servicio!', 4000, 'red');
              });
              break;

            case 'invalidar':
              this.service.removeValidationIndicadores(this.auth.getIdUsuario(), id_grupo, this.idEtad , dia).subscribe(result => {
             
                if (result.response.sucessfull) {
                  this.registros[index].estatus = 0;
                  Materialize.toast(' Quito la validación correctamente ', 4000, 'green');
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
