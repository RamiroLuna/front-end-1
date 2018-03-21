import { Component, OnInit, AfterViewInit } from '@angular/core';
import { AuthService } from '../../auth/auth.service';

declare var $: any;
declare var Materialize: any;
@Component({
  selector: 'app-lista-asignacion',
  templateUrl: './lista-asignacion.component.html'
})
export class ListaAsignacionComponent implements OnInit, AfterViewInit{
  public loading: boolean;
  public mensajeModal: string;

  constructor(private auth: AuthService
  ) { }

  ngOnInit() {
    this.loading = true;
    this.loading = false;
  }

   /* 
   * Carga de plugins para el componente
   */ 
  ngAfterViewInit(): void {
    $('.datepicker').pickadate({
      selectMonths: true, // Creates a dropdown to control month
      selectYears: 15, // Creates a dropdown of 15 years to control year,
      today: 'Hoy',
      clear: 'Limpiar',
      close: 'Ok',
      monthsFull: [ 'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre' ],
      monthsShort: [ 'Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic' ],
      weekdaysShort: [ 'Dom', 'Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab' ],
      weekdaysLetter: [ 'D', 'L', 'M', 'M', 'J', 'V', 'S' ],
      format: 'dd/mm/yyyy',
      closeOnSelect: false // Close upon selecting a date,
    });

    $('.tooltipped').tooltip({ delay: 50 });
  }


  agregar() {
    $('.tooltipped').tooltip('hide');
  }

  regresar() {
    $('.tooltipped').tooltip('hide');
  }

}
