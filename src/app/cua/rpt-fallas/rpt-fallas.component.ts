import { Component, OnInit } from '@angular/core';
import { DataTableReporte } from '../../utils';


declare var $: any;
declare var Materialize: any;
@Component({
  selector: 'app-rpt-fallas',
  templateUrl: './rpt-fallas.component.html'
})
export class RptFallasComponent implements OnInit {  
  public fallas: Array<any>=[{
    dia:'1',
    grupo:'B',
    turno:'1',
    linea:'AMUT1',
    razon:'Mantto planeado (TMP)',
    equipo:'M30A',
    nombre_equipo:'Molino humedo A.',
    problema:'Cambio de cuchillas fijas a molinos humedos',
    hrs_i:'8',
    min_i:'40',
    hrs_f:'9',
    min_f:'-',
    hrs_paro:'0.3'
  },{
    dia:'2',
    grupo:'B',
    turno:'1',
    linea:'AMUT1',
    razon:'Mantto planeado (TMP)',
    equipo:'M30A',
    nombre_equipo:'Molino humedo A.',
    problema:'Cambio de cuchillas fijas a molinos humedos',
    hrs_i:'8',
    min_i:'40',
    hrs_f:'9',
    min_f:'-',
    hrs_paro:'0.3'
  }
];

  constructor() { }

  ngOnInit() {
  
    setTimeout(()=>{this.ngAfterViewInitHttp();},20);
  }


  /* 
   * Carga de plugins para el componente
   */
  ngAfterViewInitHttp(): void {
    $('#de,#hasta').pickadate({
      selectMonths: true, // Creates a dropdown to control month
      selectYears: 15, // Creates a dropdown of 15 years to control year,
      today: '',
      clear: 'Limpiar',
      close: 'OK',
      monthsFull: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
      monthsShort: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
      weekdaysShort: ['Dom', 'Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab'],
      weekdaysLetter: ['D', 'L', 'M', 'M', 'J', 'V', 'S'],
      format: 'dd/mm/yyyy',
      closeOnSelect: false, // Close upon selecting a date,
      // onClose:  () =>{
      //     this.asignacion.dia = $('#dia').val();
      // }
    });

    $('.tooltipped').tooltip({ delay: 50 });

    $('.opciones').material_select();

    DataTableReporte('#tabla_fallas');
  }

  regresar() {
    $('.tooltipped').tooltip('hide');
  }

}
