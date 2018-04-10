import { Component, OnInit } from '@angular/core';
import { DataTableReporte } from '../../utils';

declare var $: any;
declare var Materialize: any;

@Component({
  selector: 'app-lista-produccion',
  templateUrl: './lista-produccion.component.html'
})
export class ListaProduccionComponent implements OnInit {

  public loading: boolean;
  public mensajeModal: string;
  public asignaciones: Array<any> = [
    {dia: '10/04/2018', linea: 'AMUT 1', turno: '1', grupo: 'A', produccion: '100T'},
    {dia: '11/04/2018', linea: 'AMUT 1', turno: '1', grupo: 'A', produccion: '100T'},
    {dia: '12/04/2018', linea: 'AMUT 2', turno: '1', grupo: 'A', produccion: '100T'},
    {dia: '13/04/2018', linea: 'AMUT 2', turno: '1', grupo: 'A', produccion: '100T'}
];

  constructor() { }

  ngOnInit() {
    this.loading = true;
    this.loading = false;
   
    setTimeout(() => { this.ngAfterViewHttp()}, 200)
  }

  /*
 * Carga plugins despues de cargar y mostrar objetos en el DOM
 */
  ngAfterViewHttp(): void {

    DataTableReporte('#tabla');

    $('#inicio,#fin').pickadate({
      selectMonths: true, // Creates a dropdown to control month
      selectYears: 15, // Creates a dropdown of 15 years to control year,
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

    $('.tooltipped').tooltip({ delay: 50 });
    Materialize.updateTextFields();
  }

  agregar() {
    $('.tooltipped').tooltip('hide');
  }

  regresar() {
    $('.tooltipped').tooltip('hide');
  }

}
