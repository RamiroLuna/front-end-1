import { Component, OnInit } from '@angular/core';

declare var $: any;
declare var Materialize: any;
@Component({
  selector: 'app-rpt-etad',
  templateUrl: './rpt-etad.component.html'
})
export class RptEtadComponent implements OnInit {

  constructor() { }

  ngOnInit() {
    setTimeout(() => { this.ngAfterViewHttp() }, 200)
  }

  /*
 * Carga plugins despues de cargar y mostrar objetos en el DOM
 */
  ngAfterViewHttp(): void {
    $('.opciones').material_select();
   
    $('.tooltipped').tooltip({ delay: 50 });
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
    Materialize.updateTextFields();
  }


  agregar() {
    $('.tooltipped').tooltip('hide');
  }

  regresar() {
    $('.tooltipped').tooltip('hide');
  }

}
