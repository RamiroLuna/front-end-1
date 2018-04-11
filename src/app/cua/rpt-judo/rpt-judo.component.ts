import { Component, OnInit } from '@angular/core';
import { DataTableReporte } from '../../utils';

declare var $: any;
declare var Materialize: any;
@Component({
  selector: 'app-rpt-judo',
  templateUrl: './rpt-judo.component.html'
})
export class RptJudoComponent implements OnInit {

  public inicio: string = "";
  public fin: string = "";

  public registros: Array<any> = [{
    dia: '1',
    molido1: '85.108',
    molido2: '86.450',
    total_molido: '171.558',
    acumulado: '171.558',
    plan_molido: '138.427',
    diferencia_molido: '33.131',
    eficiencia_dia_molido: '124%',
    mas_menos: '24%',
    efciencia_teorica: '98.10%',
    hojuela1: '83.491',
    hojuela2: '84.807',
    total_hojuela: '168.298',
    acumulado_hojuela: '168.298',
    plan_hojuela: '135.797',
    dif_hoj: '32.501',
    eficiencia_dia: '124%',
    meta_h: '24%',
  }, {
    dia: '2',
    molido1: '85.108',
    molido2: '86.450',
    total_molido: '171.558',
    acumulado: '171.558',
    plan_molido: '138.427',
    diferencia_molido: '33.131',
    eficiencia_dia_molido: '124%',
    mas_menos: '24%',
    efciencia_teorica: '98.10%',
    hojuela1: '83.491',
    hojuela2: '84.807',
    total_hojuela: '168.298',
    acumulado_hojuela: '168.298',
    plan_hojuela: '135.797',
    dif_hoj: '32.501',
    eficiencia_dia: '124%',
    meta_h: '24%',
  }, {

  }, {
    dia: '3',
    molido1: '85.108',
    molido2: '86.450',
    total_molido: '171.558',
    acumulado: '171.558',
    plan_molido: '138.427',
    diferencia_molido: '33.131',
    eficiencia_dia_molido: '124%',
    mas_menos: '24%',
    efciencia_teorica: '98.10%',
    hojuela1: '83.491',
    hojuela2: '84.807',
    total_hojuela: '168.298',
    acumulado_hojuela: '168.298',
    plan_hojuela: '135.797',
    dif_hoj: '32.501',
    eficiencia_dia: '124%',
    meta_h: '24%',
  }, {
    dia: '4',
    molido1: '85.108',
    molido2: '86.450',
    total_molido: '171.558',
    acumulado: '171.558',
    plan_molido: '138.427',
    diferencia_molido: '33.131',
    eficiencia_dia_molido: '124%',
    mas_menos: '24%',
    efciencia_teorica: '98.10%',
    hojuela1: '83.491',
    hojuela2: '84.807',
    total_hojuela: '168.298',
    acumulado_hojuela: '168.298',
    plan_hojuela: '135.797',
    dif_hoj: '32.501',
    eficiencia_dia: '124%',
    meta_h: '24%',
  }
  ];
  constructor() { }

  ngOnInit() {
    setTimeout(() => { this.ngAfterViewHttp() }, 200)
  }

  /*
 * Carga plugins despues de cargar y mostrar objetos en el DOM
 */
  ngAfterViewHttp(): void {
    $('.opciones').material_select();
    DataTableReporte('#tabla');
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
        this.inicio = $('#inicio').val();
        this.fin = $('#fin').val();
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
