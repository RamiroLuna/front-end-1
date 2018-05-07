import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../auth/auth.service';
import { ListaProduccionService } from './lista-produccion.service';
import { DataTableReporte, getAnioActual, getMesActual } from '../../utils';

import {
  trigger,
  state,
  style,
  animate,
  transition
} from '@angular/animations';
import { Produccion } from '../../models/produccion';

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
  public busquedaPersonalizada: boolean;
  public noMostrarComponentValidacion:boolean;
  public mostrarTabla: boolean;
  public status: string;
  public periodoAcutal: any = {
    anio: 0,
    mes: ''
  }

  public idMetaSeleccionada: number;
  public mensajeModal: string;
  public producciones: Array<Produccion>;

  constructor(private auth: AuthService,
    private service: ListaProduccionService) { }

  ngOnInit() {
    this.loading = true;
    this.noMostrarComponentValidacion = false;
    this.mostrarTabla = false;
    this.status = "inactive";
    this.producciones = [];
    this.periodoAcutal.anio = getAnioActual();
    this.periodoAcutal.mes = getMesActual();
    this.busquedaPersonalizada = false;
    this.init();

  }

  init(): void {
    this.service.getInitProduccion(this.auth.getIdUsuario()).subscribe(result => {
     
      if (result.response.sucessfull) {
        this.loading = false;
        this.mostrarTabla = true;
        this.producciones = result.data.listProduccion || [];
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

  /*
 * Carga plugins despues de cargar y mostrar objetos en el DOM
 */
  ngAfterViewHttp(): void {

    DataTableReporte('#tabla');
    $('.tooltipped').tooltip({ delay: 50 });
    Materialize.updateTextFields();
  }

  agregar() {
    $('.tooltipped').tooltip('hide');
  }

  regresar() {
    $('.tooltipped').tooltip('hide');
  }

  activaBusqueda() {
    this.busquedaPersonalizada = !this.busquedaPersonalizada;
    this.mostrarTabla = false;

    setTimeout(() => {
      this.status = this.status == 'inactive' ? 'active' : 'inactive';
    }, 20);

    if (this.busquedaPersonalizada) {

      setTimeout(() => {
        $('#inicio,#fin').pickadate({
          selectMonths: true,
          selectYears: 15,
          today: 'Hoy',
          clear: '',
          close: 'Ok',
          monthsFull: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
          monthsShort: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
          weekdaysShort: ['Dom', 'Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab'],
          weekdaysLetter: ['D', 'L', 'M', 'M', 'J', 'V', 'S'],
          format: 'dd/mm/yyyy',
          closeOnSelect: false,
          onClose: () => {
            // this.inicio = $('#inicio').val();
            // this.fin = $('#fin').val();
          }
        });
      }, 200);
    }else{
      this.init();
    }
  }

  verProduccion(idMeta:number):void{
    this.idMetaSeleccionada = idMeta;
    this.noMostrarComponentValidacion = !this.noMostrarComponentValidacion;
  }



}
