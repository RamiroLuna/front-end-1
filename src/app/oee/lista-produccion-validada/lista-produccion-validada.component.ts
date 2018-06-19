import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { ListaProduccionValidadaService } from './lista-produccion-validada.service';
import { AuthService } from '../../auth/auth.service';
import { DataTableLiberadas, findRol, getAnioActual } from '../../utils';
import { Produccion } from '../../models/produccion';
import { Catalogo } from '../../models/catalogo';
import { Periodo } from '../../models/periodo';
import { Linea } from '../../models/linea';
import swal from 'sweetalert2';

declare var $: any;
declare var Materialize: any;

@Component({
  selector: 'app-lista-produccion-validada',
  templateUrl: './lista-produccion-validada.component.html',
  providers: [ListaProduccionValidadaService],
})
export class ListaProduccionValidadaComponent implements OnInit {

  public loading: boolean;
  public datos_tabla: boolean;
  public mensajeModal: string;
  public estatusPeriodo: boolean;

  public anioSeleccionado: number;
  public submitted: boolean;
  public disabled: boolean;

  public listaProduccion: Array<Produccion>;
  public periodos: Array<Periodo> = [];
  public lineas: Array<Linea> = [];
  public grupos: Array<Catalogo> = [];
  public turnos: Array<Catalogo> = [];
  public anios: any = {};
  public meses: Array<any> = [];
  public formConsultaPeriodo: FormGroup;


  public idLinea: number;
  public idPeriodo: number;

  constructor(private auth: AuthService,
    private service: ListaProduccionValidadaService,
    private fb: FormBuilder
  ) { }

  ngOnInit() {
    this.loading = true;
    this.datos_tabla = false;
    this.submitted = false;
    this.disabled = false;
    this.estatusPeriodo = true;
    this.listaProduccion = [];

  
    this.anioSeleccionado = getAnioActual();

    this.service.getInitCatalogos(this.auth.getIdUsuario()).subscribe(result => {

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

  agregar() {
    $('.tooltipped').tooltip('hide');
  }

  regresar() {
    $('.tooltipped').tooltip('hide');
  }

  /*
 * Carga plugins despues de cargar y mostrar objetos en el DOM
 */
  ngAfterViewInitHttp(): void {
   
    $('.tooltipped').tooltip({ delay: 50 });

  }

  loadFormulario(): void {
    this.formConsultaPeriodo = this.fb.group({
      idLinea: new FormControl({ value: this.idLinea }, [Validators.required]),
      idPeriodo: new FormControl({ value: this.idPeriodo }, [Validators.required])
    });
  }

  consultaPeriodo(): void {
    this.submitted = true;

    if (this.formConsultaPeriodo.valid) {
      this.disabled = true;
      this.datos_tabla = false;

      this.service.getProducuccionLiberada(this.auth.getIdUsuario(), this.idPeriodo, this.idLinea).subscribe(result => {
  
        if (result.response.sucessfull) {
          this.estatusPeriodo = result.data.estatusPeriodo;
          this.listaProduccion = result.data.listProduccion || [];
          this.datos_tabla = true;
          this.disabled = false;

          setTimeout(() => {
            DataTableLiberadas('#tabla');     
          }, 300);


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

  changeCombo(): void {
    this.datos_tabla = false;
  }


}
