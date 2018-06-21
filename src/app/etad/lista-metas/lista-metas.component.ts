import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../../auth/auth.service';
import { Meta } from '../../models/meta';
import swal from 'sweetalert2';
import { ListaMetasService } from './lista-metas.service';
import { Periodo } from '../../models/periodo';
import { Linea } from '../../models/linea';
import { Catalogo } from '../../models/catalogo';
import { 
  deleteItemArray, 
  calculaDiaPorMes, 
  isNumeroAsignacionValid, 
  findRol,
  getMetasKPI,
  getFrecuenciaMetaKPI
} from '../../utils';
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
  selector: 'app-lista-metas',
  templateUrl: './lista-metas.component.html',
  providers: [ListaMetasService],
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
export class ListaMetasComponent implements OnInit {

  public loading: boolean;
  public datos_tabla: boolean;
  public mensajeModal: string;
  public estatusPeriodo: boolean;

  public anioSeleccionado: number;
  public frecuencia: string;
  public submitted: boolean;
  public disabled: boolean;

  public tiposMeta: Array<any> = [];
  public frecuanciasDisponibles: Array<any> = [];
  public periodos: Array<Periodo> = [];
  public lineas: Array<Linea> = [];
  public grupos: Array<Catalogo> = [];
  public turnos: Array<Catalogo> = [];
  public anios: Array<any> = [];
  public meses: Array<any> = [];
  public metas: Array<Meta> = [];
  public formConsultaPeriodo: FormGroup;
  public status: string;

  public idEtad: number;
  public idPeriodo: number;


  public permission: any = {
    editarMeta: false,
    eliminarMeta: false
  }

  constructor(private auth: AuthService,
    private service: ListaMetasService,
    private fb: FormBuilder
  ) { }

  ngOnInit() {
    this.loading = true;
    this.datos_tabla = false;
    this.submitted = false;
    this.disabled = false;
    this.estatusPeriodo = true;

    this.permission.editarMeta = findRol(3, this.auth.getRolesOee());
    this.permission.eliminarMeta = findRol(5, this.auth.getRolesOee());

    this.tiposMeta = getMetasKPI();
    this.frecuanciasDisponibles = getFrecuenciaMetaKPI();


    this.service.getInitCatalogos(this.auth.getIdUsuario()).subscribe(result => {
      console.log('init ', result)
      if (result.response.sucessfull) {

        this.lineas = result.data.listLineas || [];
        this.periodos = result.data.listPeriodos || [];
        this.grupos = result.data.listGrupos || [];
        this.grupos = this.grupos.filter((el) => el.id != 6);
        this.turnos = result.data.listTurnos || [];
        let tmpAnios = this.periodos.map(el => el.anio);
        this.periodos.filter((el, index) => {
          return tmpAnios.indexOf(el.anio) === index;
        }).forEach((el) => {
          let tmp = el.anio;
          this.anios.push({ value: tmp, descripcion: tmp})
        });

        this.meses = this.periodos.filter(el => el.anio == this.anioSeleccionado);

        this.loading = false;
        this.loadFormulario();
        // setTimeout(() => { this.ngAfterViewInitHttp() }, 200)
      } else {
        Materialize.toast(result.response.message, 4000, 'red');
        this.loading = false;
      }
    }, error => {
      Materialize.toast('Ocurrió  un error en el servicio!', 4000, 'red');
      this.loading = false;
    });
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
    this.estatusPeriodo = true;
    this.datos_tabla = false;
    this.status = "inactive";
  }

  openModalTipoMeta(event): void {
    event.preventDefault();
    // swal({
    //   title: 'Seleccione tipo de meta',
    //   input: 'select',
    //   cancelButtonText: 'Cancelar',
    //   confirmButtonText: 'OK',
    //   inputOptions: this.anios,
    //   inputPlaceholder: 'SELECCIONE',
    //   showCancelButton: true,
    //   inputValidator: (value) => {

    //     return new Promise((resolve) => {
    //       this.formConsultaPeriodo.reset();
    //       this.submitted = false;
    //       this.status = "inactive";
    //       this.datos_tabla = false;


    //       if (value != '') {
    //         resolve();
    //         this.anioSeleccionado = value;
    //         this.meses = this.periodos.filter(el => el.anio == this.anioSeleccionado);
    //       } else {
    //         resolve('Seleccione un año')
    //       }
    //     })
    //   }
    // })
  }

  loadFormulario(): void {
    this.formConsultaPeriodo = this.fb.group({
      frecuencia: new FormControl({ value: this.frecuencia }, [Validators.required]),
      anioSeleccionado: new FormControl({ value: this.anioSeleccionado }, [Validators.required]),
      idEtad: new FormControl({ value: this.idEtad }, [Validators.required]),
      idPeriodo: new FormControl({ value: this.idPeriodo }, [Validators.required])
    });
  }

  consultaPeriodo(): void {
    this.submitted = true;
    this.status = "inactive";

    if (this.formConsultaPeriodo.valid) {
      this.disabled = true;
      this.datos_tabla = false;

      this.service.getAllMetas(this.auth.getIdUsuario(), this.idPeriodo, this.idEtad).subscribe(result => {

        if (result.response.sucessfull) {
          this.estatusPeriodo = result.data.estatusPeriodo;
          this.metas = result.data.listMetas || [];
          this.datos_tabla = true;
          this.disabled = false;

          setTimeout(() => {
            // this.ngAfterViewInitHttp();
            this.status = 'active';
          }, 200);


        } else {
          Materialize.toast(result.response.message, 4000, 'red');
        }
      }, error => {
        Materialize.toast('Ocurrió  un error en el servicio!', 4000, 'red');
      });

    } else {
      Materialize.toast('Se encontrarón errores!', 4000, 'red');
    }



  }





  obtenerMesDelPeriodo(arg: Array<Periodo>, idPeriodo: number): number {
    let result = arg.filter((el) => el.id_periodo == idPeriodo);
    if (result.length > 0) {
      return result[0].mes;
    } else {
      return -1;
    }
  }

  arrayDescriptivo(arg: Array<Catalogo>): Array<string> {
    return arg.map((el) => el.valor);
  }

  idItemCombo(arg: Array<Catalogo>, valor: string): number {
    let element = arg.filter((el) => el.valor == valor.trim());
    if (element.length > 0) {
      return element[0].id;
    } else {
      return -1;
    }

  }

  findRowForecast(metas: Array<Meta>, id_meta: number): Meta {
    let meta: Meta;
    let el = metas.filter(el => el.id_meta == id_meta);
    if (el.length > 0) {
      meta = el[0];
    }
    return meta;
  }

}
