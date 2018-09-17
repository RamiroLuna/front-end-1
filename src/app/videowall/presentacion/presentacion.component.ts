import { Component, OnInit } from '@angular/core';
import { configChart as configPerdidas } from '../../oee/rpt-fuente-perdidas/rpt.config.export';
import { configChart as configDisponiblidad } from '../../oee/rpt-disponibilidad/rpt.config.export';
import { configChart as configOEE } from '../../oee/rpt-oee/rpt.config.export';
import { configChart as configJucodi } from '../../oee/rpt-jucodi/rpt.config.export';
import { configChart as configRealPlan, configChartSpider } from '../../oee/rpt-produccion-real-plan/rpt.config.export';
import { configChartSpider as configVelocidad } from '../../oee/rpt-velocidad-promedio/rpt.config.export';
import { clone } from '../../utils';
import {
  ANIMATION_PRELOADER,
  EFECTS_ENFASIS
} from './presentacion.animaciones';

declare var $: any;
@Component({
  selector: 'app-presentacion',
  templateUrl: './presentacion.component.html',
  styleUrls: ['./presentacion.component.css'],
  animations: [ANIMATION_PRELOADER]
})
export class PresentacionComponent implements OnInit {

  private TOTAL: number;
  public type_animation: string = 'entrada';
  public steep_index: number = 1;
  public loading: boolean;
  public isOk: boolean;
  public OEE: any;
  public status: string;
  public height: number;
  public time_await: number = 4000; // tiempo en milisegundos

  constructor() { }

  ngOnInit() {
    this.loading = true;
    this.isOk = false;

    this.OEE = localStorage.getItem('OEE');
    console.log(this.OEE)

    if (this.OEE == null || this.OEE === undefined) {
      this.loading = false;
    } else {
      this.height = $(window).height() - 100;
      this.OEE = JSON.parse(this.OEE);
      this.TOTAL = this.OEE.length + 1;
      this.isOk = true;
      this.loading = false;
      // Tiene los datos para poder trabajar 
      this.status = 'inactive';
    }


  }

  animationDone(event: any): void {

    setTimeout(() => {

      switch (this.type_animation) {
        case 'entrada':

          if (this.steep_index > 1) {
            this.buildChart(this.steep_index);
          } else {
            this.status = 'active';
            this.type_animation = 'enfasis';
          }
          break;
        case 'enfasis':
          setTimeout(() => {
            const EFECT_RANDOM = Math.floor(Math.random() * EFECTS_ENFASIS.length);
            this.status = EFECTS_ENFASIS[EFECT_RANDOM];
            this.type_animation = 'salida';
          }, this.time_await);
          break;
        case 'salida':
          this.status = 'inactive';
          this.type_animation = 'fin';
          break;
        case 'fin':
          if (this.steep_index < this.TOTAL) {
            setTimeout(() => {
              this.steep_index = this.steep_index + 1;
              this.status = 'inactive';
              this.type_animation = 'entrada';
            }, 200);
          }

          break;
      }

    }, 200);

  }

  buildChart(steep: number) {
    //setTimeout time para construir grafica
    setTimeout(() => {
      switch (steep) {
        /*
         * Graficas AMUT 1
         */
        case 2:
          this.buildChartPerdida(0);
          break;
        case 3:
          this.buildChartDisponiblidad(1);
          break;
        case 4:
          this.buildChartOEE(2);
          break;
        case 5:
          this.buildChartJucodi(3);
          break;
        case 6:
          this.buildChartRealvsPlanBarras(4);
          break;
        case 7:
          this.buildChartSpider(5);
          break;
        case 8:
          this.buildChartVelocidad(6);
          break;
        case 9:
          this.buildChartPoliolefinas(7);
          break;
        /*
       * Graficas AMUT 2
       */
        case 10:
          this.buildChartPerdida(8);
          break;
        case 11:
          this.buildChartDisponiblidad(9);
          break;
        case 12:
          this.buildChartOEE(10);
          break;
        case 13:
          this.buildChartJucodi(11);
          break;
        case 14:
          this.buildChartRealvsPlanBarras(12);
          break;
        case 15:
          this.buildChartSpider(13);
          break;
        case 16:
          this.buildChartVelocidad(14);
          break;
        case 17:
          this.buildChartPoliolefinas(15);
          break;
      }

      //Ejecuta evento de animación
      setTimeout(() => {

        this.status = 'active';
        this.type_animation = 'enfasis';
      }, 200);
    }, 200);

  }

  buildChartPerdida(position_data:number): void {
    let configuracion = clone(configPerdidas);
    this.time_await = 20000;   
    let rows = this.OEE[position_data]
    let labels = rows.filter((el) => el.padre == 0).map((el) => el.fuente);
    let horas = rows.filter((el) => el.padre == 0).map((el) => el.hrs);
    let titulo = rows.filter(el => el.padre == 1)[0].titulo_grafica;
    configuracion.exporting.enabled = false;
    configuracion.chart.height = this.height;
    configuracion.series = [];
    configuracion.title.text = titulo;
    configuracion.xAxis.categories = labels;
    configuracion.series.push({ name: 'Horas Muertas', data: horas });
    $('#grafica').highcharts(configuracion);
  }

  buildChartDisponiblidad(position_data:number): void {
    let configuracion = clone(configDisponiblidad);
    this.time_await = 10000;
    let rows = this.OEE[position_data];

    let labels = rows.filter((el) => el.padre == 0).map((el) => el.titulo);
    let horas = rows.filter((el) => el.padre == 0).map((el) => el.hrs);
    rows.filter((el) => el.padre == 2).map((el) => {
      horas.push(el.hrs);
      labels.push(el.titulo);
    });

    let titulo = rows.filter(el => el.padre == 1)[0].titulo_grafica;
    configuracion.exporting.enabled = false;
    configuracion.chart.height = this.height;
    configuracion.series = [];
    configuracion.title.text = titulo;
    configuracion.xAxis.categories = labels;
    configuracion.series.push({ name: ' Horas ', data: horas });

    $('#grafica').highcharts(configuracion);
  }

  buildChartOEE(position_data:number): void {
    let configuracion = clone(configOEE);
    this.time_await = 15000;
    let rows = this.OEE[position_data];

    let meta_esperada = rows.filter((el) => el.padre == 0).map((el) => el.meta);
    let labels = rows.filter((el) => el.padre == 0).map((el) => el.titulo);
    let horas = rows.filter((el) => el.padre == 0).map((el) => el.porcentaje);
    let titulo = rows.filter(el => el.padre == 1)[0].titulo_grafica;

    horas = horas.map(el => el = parseFloat(el).toFixed(3));
    horas = horas.map(el => el = parseFloat(el));

    meta_esperada = meta_esperada.map(el => el = parseFloat(el).toFixed(3));
    meta_esperada = meta_esperada.map(el => el = parseFloat(el));

    configuracion.exporting.enabled = false;
    configuracion.chart.height = this.height;
    configuracion.series = [];
    configuracion.title.text = titulo;
    configuracion.xAxis.categories = labels;
    configuracion.series.push({ name: ' Real ', data: horas });
    configuracion.series.push({ name: ' Meta esperada ', data: meta_esperada, type: 'line' });

    $('#grafica').highcharts(configuracion);
  }

  buildChartJucodi(position_data:number): void {
    let configuracion = clone(configJucodi);
    this.time_await = 25000;

    let datosPorLinea = this.OEE[position_data];

    let titulo = datosPorLinea[0].titulo_grafica;
    let labels = datosPorLinea.filter((el) => el.padre == 0).map(element => element.dia);
    let dataGrupoA = datosPorLinea.filter((el) => el.padre == 0).map((el) => el.a);
    let dataGrupoB = datosPorLinea.filter((el) => el.padre == 0).map((el) => el.b);
    let dataGrupoC = datosPorLinea.filter((el) => el.padre == 0).map((el) => el.c);
    let dataGrupoD = datosPorLinea.filter((el) => el.padre == 0).map((el) => el.d);
    let dataMeta1 = datosPorLinea.filter((el) => el.padre == 0).map((el) => el.meta1);
    let dataMeta2 = datosPorLinea.filter((el) => el.padre == 0).map((el) => el.meta2);
    let dataMeta3 = datosPorLinea.filter((el) => el.padre == 0).map((el) => el.meta3);

    configuracion.exporting.enabled = false;
    configuracion.chart.height = this.height;
    configuracion.series = [];
    configuracion.xAxis.categories = labels;
    configuracion.title.text = titulo;

    configuracion.series.push({ name: ' A ', data: dataGrupoA, color: '#ef5350' });
    configuracion.series.push({ name: ' B ', data: dataGrupoB, color: '#66bb6a' });
    configuracion.series.push({ name: ' C ', data: dataGrupoC, color: '#d4e157' });
    configuracion.series.push({ name: ' D ', data: dataGrupoD, color: '#42a5f5' });
    configuracion.series.push({ name: ' Meta 1ro ', data: dataMeta1, type: 'line', color: '#ffcc80', dashStyle: 'Dash' });
    configuracion.series.push({ name: ' Meta 2do ', data: dataMeta2, type: 'line', color: '#ff9800', dashStyle: 'Dash' });
    configuracion.series.push({ name: ' Meta dia ', data: dataMeta3, type: 'line', color: '#e65100', dashStyle: 'Dash' });

    $('#grafica').highcharts(configuracion);
  }

  buildChartRealvsPlanBarras(position_data:number): void {
    let configuracion = clone(configRealPlan);
    this.time_await = 20000;

    let datos = this.OEE[position_data];
    let labels = datos.filter((el) => el.padre == 0).map(element => element.periodo);
    let dataReal = datos.filter((el) => el.padre == 0).map(element => element.real);
    let dataEsperada = datos.filter((el) => el.padre == 0).map(element => element.meta);
    let titulo = datos.filter(el => el.padre == 1)[0].titulo_grafica;

    configuracion.plotOptions.column.dataLabels.rotation = 270;
    configuracion.exporting.enabled = false;
    configuracion.chart.height = this.height;
    configuracion.series = [];
    configuracion.xAxis.categories = labels;
    configuracion.title.text = titulo;

    configuracion.series.push({ name: ' Real ', data: dataReal, color: '#dcedc8' });
    configuracion.series.push({ name: ' Meta ', data: dataEsperada, type: 'line', color: '#1a237e' });

    $('#grafica').highcharts(configuracion);
  }

  buildChartSpider(position_data:number): void {
    let configuracion = clone(configChartSpider);
    this.time_await = 10000;

    let datosRRadar = this.OEE[position_data];
    configuracion.exporting.enabled = false;
    configuracion.chart.height = this.height;
    configuracion.series = [];
    configuracion.xAxis.categories = [];
    configuracion.title.text = 'Producción real vs plan';
    let esperada = [];
    let real = [];
    let legeng = ':grupo:<br><span style="color:#9e9d24">:real:</span><br><span style="color:#283593">:meta:</span>';

    let esperadaTmp = datosRRadar.filter((el) => el.padre == 0)[0];
    let realTmp = datosRRadar.filter((el) => el.padre == 0)[0];

    esperada.push(esperadaTmp.metaa);
    esperada.push(esperadaTmp.metab);
    esperada.push(esperadaTmp.metac);
    esperada.push(esperadaTmp.metad);

    real.push(realTmp.reala);
    real.push(realTmp.realb);
    real.push(realTmp.realc);
    real.push(realTmp.reald);

    let categorias = [];
    categorias.push(legeng.replace(':grupo:', 'Grupo A').replace(':real:', realTmp.reala).replace(':meta:', realTmp.metaa));
    categorias.push(legeng.replace(':grupo:', 'Grupo B').replace(':real:', realTmp.realb).replace(':meta:', realTmp.metab));
    categorias.push(legeng.replace(':grupo:', 'Grupo C').replace(':real:', realTmp.realc).replace(':meta:', realTmp.metac));
    categorias.push(legeng.replace(':grupo:', 'Grupo D').replace(':real:', realTmp.reald).replace(':meta:', realTmp.metad));

    configuracion.xAxis.categories = categorias;

    configuracion.series.push({
      color: '#283593',
      name: ' Meta ',
      data: esperada,
      pointPlacement: 'on',
      dataLabels: {
        color: '#1a237e'
      }
    });

    configuracion.series.push({
      color: '#9e9d24',
      name: ' Real ',
      data: real,
      pointPlacement: 'on',
      dataLabels: {
        y: 5,
        color: '#9e9d24'
      }
    });

    $('#grafica').highcharts(configuracion);

  }

  buildChartVelocidad(position_data:number): void {
    let configuracion = clone(configVelocidad);
    this.time_await = 10000;

    let row = this.OEE[position_data];

    let esperada = [];
    let real = [];

    let esperadaTmp = row.filter((el) => el.padre == 0)[0];
    let titulo = row.filter(el => el.padre == 1)[0].titulo_grafica;

    configuracion.exporting.enabled = false;
    configuracion.chart.height = this.height;
    configuracion.series = [];
    configuracion.xAxis.categories = [];
    configuracion.title.text = titulo;

    configuracion.xAxis.categories.push('GRUPO A<br><b>' + esperadaTmp.sppeda + '</b>');
    configuracion.xAxis.categories.push('GRUPO B<br><b>' + esperadaTmp.sppedb + '</b>');
    configuracion.xAxis.categories.push('GRUPO C<br><b>' + esperadaTmp.sppedc + '</b>');
    configuracion.xAxis.categories.push('GRUPO D<br><b>' + esperadaTmp.sppedd + '</b>');


    esperada.push(esperadaTmp.sppeda);
    esperada.push(esperadaTmp.sppedb);
    esperada.push(esperadaTmp.sppedc);
    esperada.push(esperadaTmp.sppedd);
    configuracion.series.push({ color: '#b71c1c', name: ' Velocidad promedio ', data: esperada, pointPlacement: 'on' });

    $('#grafica').highcharts(configuracion);

  }

  buildChartPoliolefinas(position_data:number): void {
    let configuracion = clone(configJucodi);
    this.time_await = 25000;

    let datosPorLinea = this.OEE[position_data];

    let titulo = datosPorLinea[0].titulo_grafica;
    let labels = datosPorLinea.filter((el) => el.padre == 0).map(element => element.dia);
    let dataGrupoA = datosPorLinea.filter((el) => el.padre == 0).map((el) => el.a);
    let dataGrupoB = datosPorLinea.filter((el) => el.padre == 0).map((el) => el.b);
    let dataGrupoC = datosPorLinea.filter((el) => el.padre == 0).map((el) => el.c);
    let dataGrupoD = datosPorLinea.filter((el) => el.padre == 0).map((el) => el.d);
    let dataMeta1 = datosPorLinea.filter((el) => el.padre == 0).map((el) => el.meta1);
    let dataMeta2 = datosPorLinea.filter((el) => el.padre == 0).map((el) => el.meta2);
    let dataMeta3 = datosPorLinea.filter((el) => el.padre == 0).map((el) => el.meta3);

    configuracion.exporting.enabled = false;
    configuracion.chart.height = this.height;
    configuracion.series = [];
    configuracion.xAxis.categories = labels;
    configuracion.title.text = titulo;

    configuracion.series.push({ name: ' A ', data: dataGrupoA, color: '#ef5350' });
    configuracion.series.push({ name: ' B ', data: dataGrupoB, color: '#66bb6a' });
    configuracion.series.push({ name: ' C ', data: dataGrupoC, color: '#d4e157' });
    configuracion.series.push({ name: ' D ', data: dataGrupoD, color: '#42a5f5' });
    configuracion.series.push({ name: ' Meta 1ro ', data: dataMeta1, type: 'line', color: '#ffcc80', dashStyle: 'Dash' });
    configuracion.series.push({ name: ' Meta 2do ', data: dataMeta2, type: 'line', color: '#ff9800', dashStyle: 'Dash' });
    configuracion.series.push({ name: ' Meta dia ', data: dataMeta3, type: 'line', color: '#e65100', dashStyle: 'Dash' });

    $('#grafica').highcharts(configuracion);
  }




}
