import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../auth/auth.service';
import { ListaProduccionService } from './lista-produccion.service';
import { DataTableProduccion, getAnioActual, getMesActual, findRol } from '../../utils';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import swal from 'sweetalert2';
import {
  trigger,
  state,
  style,
  animate,
  transition
} from '@angular/animations';
import { Produccion } from '../../models/produccion';
import { Periodo } from '../../models/periodo';
import { Linea } from '../../models/linea';

declare var $: any;
declare var Materialize: any;

@Component({
  selector: 'app-lista-produccion',
  templateUrl: './lista-produccion.component.html',
  styleUrls: ['./lista-produccion.component.css'],
  providers: [ListaProduccionService],
  animations: [
    trigger('visibility', [
      state('inactive', style({
        opacity: 0
      })),
      state('active', style({
        opacity: 1
      })),
      transition('inactive => active', animate('500ms ease-in')),
      transition('active => inactive', animate('500ms ease-out'))
    ])
  ]
})
export class ListaProduccionComponent implements OnInit {

  public loading: boolean;
  public showBtnRegistrar: boolean;
  public noMostrarComponentValidacion: boolean;

  public status: string;
  public periodoAcutal: any = {
    anio: 0,
    mes: ''
  }

  public datos_tabla: boolean;
  public submitted: boolean;
  public disabled: boolean;
  public idMetaSeleccionada: number;
  public formConsultaPeriodo: FormGroup;
  public seccion: string;
  public mensajeModal: string;
  public producciones: Array<Produccion>;
  public anioSeleccionado: number;
  public periodos: Array<Periodo> = [];
  public anios: any = {};
  public meses: Array<any> = [];
  public lineas: Array<Linea> = [];
  public idLinea: number;
  public idPeriodo: number;
  public estatusPeriodo: boolean;


  public permission: any = {
    consultaByLine: false,
    agregarProduccion: false
  }


  constructor(private auth: AuthService,
    private service: ListaProduccionService,
    private fb: FormBuilder) { }

  ngOnInit() {
    this.loading = true;
    this.showBtnRegistrar = false;
    this.noMostrarComponentValidacion = false;
    this.status = "inactive";
    this.producciones = [];
    this.periodoAcutal.anio = getAnioActual();
    this.periodoAcutal.mes = getMesActual();
    this.datos_tabla = false;
    this.submitted = false;
    this.estatusPeriodo = true;
    this.anioSeleccionado = getAnioActual();
    this.permission.agregarProduccion = findRol(17, this.auth.getRolesCUA());
    this.permission.consultaByLine = this.auth.permissionEdit(1) || this.auth.permissionEdit(2) || this.auth.permissionEdit(3);
    if (this.permission.consultaByLine) this.idLinea = this.auth.getId_Linea();
    this.init();

  }

  init(): void {

    this.service.getInitCatalogos(this.auth.getIdUsuario()).subscribe(result => {

      if (result.response.sucessfull) {

        this.lineas = result.data.listLineas || [];
        this.lineas = this.lineas.filter(el => el.id_linea != 6).map(el => el);
        this.periodos = result.data.listPeriodos || [];

        let tmpAnios = this.periodos.map(el => el.anio);
        this.periodos.filter((el, index) => {
          return tmpAnios.indexOf(el.anio) === index;
        }).forEach((el) => {
          let tmp = el.anio;
          this.anios[tmp] = tmp;
        });

        this.meses = this.periodos.filter(el => el.anio == this.anioSeleccionado);

        //si es undefined no viene meta
        if (typeof result.data.listDetalle != "undefined") {

          if (result.data.listDetalle.length > 0) {
            this.showBtnRegistrar = false;
          } else {
            this.showBtnRegistrar = true;
          }
        }

        this.loading = false;
        this.loadFormulario();
        setTimeout(() => { this.ngAfterViewHttp() }, 200)
      } else {
        Materialize.toast('Ocurrió  un error al consultar catalogos!', 4000, 'red');
        this.loading = false;
      }
    }, error => {
      Materialize.toast('Ocurrió  un error en el servicio!', 4000, 'red');
      this.loading = false;
    });
  }

  loadFormulario(): void {
    this.formConsultaPeriodo = this.fb.group({
      idLinea: new FormControl({ value: this.idLinea, disabled: this.permission.consultaByLine }, [Validators.required]),
      idPeriodo: new FormControl({ value: this.idPeriodo }, [Validators.required])
    });
  }

  changeCombo(): void {
    this.estatusPeriodo = true;
    this.datos_tabla = false;
    this.status = "inactive";
  }

  /*
 * Carga plugins despues de cargar y mostrar objetos en el DOM
 */
  ngAfterViewHttp(): void {
    $('.tooltipped').tooltip({ delay: 50 });
    Materialize.updateTextFields();
  }

  agregar() {
    $('.tooltipped').tooltip('hide');
  }

  regresar() {
    $('.tooltipped').tooltip('hide');
  }

  verProduccion(idMeta: number): void {
    this.seccion = "consulta";
    this.idMetaSeleccionada = idMeta;

    this.noMostrarComponentValidacion = !this.noMostrarComponentValidacion;
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

  consultaPeriodo(): void {
    this.submitted = true;
    this.status = "inactive";

    if (this.formConsultaPeriodo.valid) {
      this.disabled = true;
      this.datos_tabla = false;

      this.service.getProduccion(this.auth.getIdUsuario(), this.idPeriodo).subscribe(result => {

        if (result.response.sucessfull) {
          this.disabled = false;
          this.datos_tabla = true;
          this.estatusPeriodo = result.data.estatusPeriodo;

          this.producciones = result.data.listProduccion || [];


          setTimeout(() => {
            // this.status = "active";
            DataTableProduccion('#tabla');
          }, 400)
        } else {
          Materialize.toast('Ocurrió  un error al consultar la producción!', 4000, 'red');
        }
      }, error => {
        Materialize.toast('Ocurrió  un error en el servicio!', 4000, 'red');

      });
    } else {
      Materialize.toast('Se encontrarón errores!', 4000, 'red');
    }

  }

  help(event): void {
    $('.tooltipped').tooltip('hide');
    event.preventDefault();
    swal({
      title: 'Ayuda',
      type: 'info',
      html: ' Para agregar la producción haga clic en el boton <i class="material-icons"><i class="material-icons">add</i></i> <br>' + 
              'El boton estará disponible de acuerdo al siguiente horario:</br>'+
              '<ul>'+
                '<li>00:00 a 7:59 turno 1</li>'+
                '<li>08:00 a 15:59 turno 2</li>'+
                '<li>16:00 a 23:59 turno 3</li>'+
              '</ul>',
      showCloseButton: false,
      showCancelButton: false,
      focusConfirm: false,
      confirmButtonText: 'Ok!'
    })

  }




}
