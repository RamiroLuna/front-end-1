import { Component, OnInit } from '@angular/core';


declare var $: any;
declare var Materialize: any;
@Component({
  selector: 'app-meta-masiva',
  templateUrl: './meta-masiva.component.html'
})
export class MetaMasivaComponent implements OnInit {

  public metas:Array<any>= [
    { dia: '1',  turno:'1', grupo: 'A',meta:'23.23', t_dia:'8', tmp:'12', tdisp:'12', vel:'12'},
    { dia: '1',  turno:'2', grupo: 'A',meta:'23.23', t_dia:'8', tmp:'12', tdisp:'12', vel:'12'},
    { dia: '1',  turno:'3', grupo: 'A',meta:'23.23', t_dia:'8', tmp:'12', tdisp:'12', vel:'12'},
    { dia: '2',  turno:'1', grupo: 'A',meta:'23.23', t_dia:'8', tmp:'12', tdisp:'12', vel:'12'},
    { dia: '2',  turno:'2', grupo: 'A',meta:'23.23', t_dia:'8', tmp:'12', tdisp:'12', vel:'12'},
    { dia: '2',  turno:'3', grupo: 'A',meta:'23.23', t_dia:'8', tmp:'12', tdisp:'12', vel:'12'}
  ];
  constructor() { }

  ngOnInit() {
    setTimeout(()=>{this.ngAfterViewInitHttp();},20);
  }

  /* 
   * Carga de plugins para el componente
   */
  ngAfterViewInitHttp(): void {
    $('#mes').pickadate({
      selectMonths: true, // Creates a dropdown to control month
      selectYears: 15, // Creates a dropdown of 15 years to control year,
      today: '',
      clear: 'Limpiar',
      close: 'OK',
      monthsFull: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
      monthsShort: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
      weekdaysShort: ['Dom', 'Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab'],
      weekdaysLetter: ['D', 'L', 'M', 'M', 'J', 'V', 'S'],
      format: 'mm/yyyy',
      closeOnSelect: false, // Close upon selecting a date,
      // onClose:  () =>{
      //     this.asignacion.dia = $('#dia').val();
      // }
    });
    $('.opciones').material_select();
    $('.tooltipped').tooltip({ delay: 50 });

  }

  regresar() {
    $('.tooltipped').tooltip('hide');
  }

}
