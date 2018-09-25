import { Component, OnInit } from '@angular/core';
import { configChart as configPerdidas } from '../../oee/rpt-fuente-perdidas/rpt.config.export';
import { configChart as configDisponiblidad } from '../../oee/rpt-disponibilidad/rpt.config.export';
import { configChart as configOEE } from '../../oee/rpt-oee/rpt.config.export';
import { configChart as configJucodi } from '../../oee/rpt-jucodi/rpt.config.export';
import { configChart as configRealPlan, configChartSpider } from '../../oee/rpt-produccion-real-plan/rpt.config.export';
import { configChartSpider as configVelocidad } from '../../oee/rpt-velocidad-promedio/rpt.config.export';
import { configChart as configAnual } from '../../etad/rpt-posicion-anual/rpt.config.export';
import { configChart as configTrimestral } from '../../etad/rpt-posicion-trimestral/rpt.config.export';
import { configChart as configKPI } from '../../etad/rpt-graficas-kpi/rpt.config.export';
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
  public steep_index: number = 46;
  public loading: boolean;
  public isOk: boolean;
  public OEE: any;
  public KPI: any;
  public POSICION: any;
  public status: string;
  public height: number;
  public endVideoWall: boolean;
  /*
   * Variables auxiliares para mostrar KPI
   */
  public imageEtadPresentation: string;
  public auxIndexETAD: number;
  public finishPresentationEtad: boolean;
  public row: Array<any>;
  public review: boolean;
  public auxIndexKPI: number;
  /*
   * Fin variables auxiliares de KPI'S
   */
  public time_await: number = 4000; // tiempo en milisegundos

  constructor() { }

  ngOnInit() {
    this.loading = true;
    this.isOk = false;
    this.endVideoWall = false;
    this.auxIndexETAD = 0;
    this.auxIndexKPI = -3;
    this.finishPresentationEtad = false;
    this.imageEtadPresentation = 'assets/videowall_etad_id_:idEtad:.png';
    this.row = [];
    this.OEE = localStorage.getItem('OEE');
    this.KPI = localStorage.getItem('KPI');
    this.POSICION = localStorage.getItem('POSICION');


    if (this.OEE == null || this.OEE === undefined
      || this.KPI == null || this.KPI === undefined
      || this.POSICION == null || this.POSICION === undefined
    ) {
      this.loading = false;
    } else {
      this.height = $(window).height() - 100;
      this.OEE = JSON.parse(this.OEE);
      this.KPI = JSON.parse(this.KPI);
      this.POSICION = JSON.parse(this.POSICION);
      debugger
      this.TOTAL = this.OEE.length + this.POSICION.length + this.KPI.length + 7; // Se suma " 7 " la cantidad de diapositivas de presentacion 

      this.isOk = true;
      this.loading = false;
      // Tiene los datos para poder trabajar 
      this.status = 'inactive';
    }


  }

  animationDone(event: any): void {

    setTimeout(() => {

      debugger
      switch (this.type_animation) {
        case 'entrada':

          if (this.steep_index > 2) {
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
          setTimeout(() => {
            this.status = 'inactive';
            this.type_animation = 'fin';
          }, 1000);
          break;
        case 'fin':
          debugger
          if (this.steep_index < 51) {
            setTimeout(() => {
              if (!this.endVideoWall) {

                this.steep_index = this.steep_index + 1;
                this.status = 'inactive';
                this.type_animation = 'entrada';
                debugger
                if (this.steep_index > 47 && this.steep_index <= 51) {
                  this.review = false;
                  this.auxIndexKPI = this.auxIndexKPI + 3;
                  setTimeout(() => {
                    this.review = true;
                  }, 15);
                }

               /*if (this.finishPresentationEtad) {

                  if (this.auxIndexETAD < (this.KPI.length) - 1) {
                    this.imageEtadPresentation = 'assets/videowall_etad_id_:idEtad:.png';
                    this.finishPresentationEtad = false;
                    this.auxIndexETAD++;
                    this.auxIndexKPI = -3;
                    this.steep_index = 47;
                  } else {
                    // Fin de la presentacion
                    this.endVideoWall = true;
                    alert('fin')
                  }
               }*/
              }


            }, 200);
          }
          else{
            this.imageEtadPresentation = 'assets/videowall_etad_id_:idEtad:.png';
            this.steep_index = 47
            this.status = 'inactive';
            this.type_animation = 'entrada';
            this.auxIndexETAD++;
            this.auxIndexKPI = -3;
            
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
          this.time_await = 5000;
          break;
        case 3:
          this.buildChartPerdida(0);
          break;
        case 4:
          this.buildChartDisponiblidad(1);
          break;
        case 5:
          this.buildChartOEE(2);
          break;
        case 6:
          this.buildChartJucodi(3);
          break;
        case 7:
          this.buildChartRealvsPlanBarras(4);
          break;
        case 8:
          this.buildChartSpider(5);
          break;
        case 9:
          this.buildChartVelocidad(6);
          break;
        case 10:
          this.buildChartPoliolefinas(7);
          break;
        /*
         * Graficas AMUT 2
         */
        case 11:
          this.time_await = 5000;
          break;
        case 12:
          this.buildChartPerdida(8);
          break;
        case 13:
          this.buildChartDisponiblidad(9);
          break;
        case 14:
          this.buildChartOEE(10);
          break;
        case 15:
          this.buildChartJucodi(11);
          break;
        case 16:
          this.buildChartRealvsPlanBarras(12);
          break;
        case 17:
          this.buildChartSpider(13);
          break;
        case 18:
          this.buildChartVelocidad(14);
          break;
        case 19:
          this.buildChartPoliolefinas(15);
          break;
        /*
         * Graficas EXT 1
         */
        case 20:
          this.time_await = 5000;
          break;
        case 21:
          this.buildChartPerdida(16);
          break;
        case 22:
          this.buildChartDisponiblidad(17);
          break;
        case 23:
          this.buildChartOEE(18);
          break;
        case 24:
          this.buildChartJucodi(19);
          break;
        case 25:
          this.buildChartRealvsPlanBarras(20);
          break;
        case 26:
          this.buildChartSpider(21);
          break;
        case 27:
          this.buildChartVelocidad(22);
          break;
        /*
         * Graficas EXT 2
         */
        case 28:
          this.time_await = 5000;
          break;
        case 29:
          this.buildChartPerdida(23);
          break;
        case 30:
          this.buildChartDisponiblidad(24);
          break;
        case 31:
          this.buildChartOEE(25);
          break;
        case 32:
          this.buildChartJucodi(26);
          break;
        case 33:
          this.buildChartRealvsPlanBarras(27);
          break;
        case 34:
          this.buildChartSpider(28);
          break;
        case 35:
          this.buildChartVelocidad(29);
          break;
        /*
         * Graficas SSP
         */
        case 36:
          this.time_await = 5000;
          break;
        case 37:
          this.buildChartPerdida(30);
          break;
        case 38:
          this.buildChartDisponiblidad(31);
          break;
        case 39:
          this.buildChartOEE(32);
          break;
        case 40:
          this.buildChartJucodi(33);
          break;
        case 41:
          this.buildChartRealvsPlanBarras(34);
          break;
        case 42:
          this.buildChartSpider(35);
          break;
        case 43:
          this.buildChartVelocidad(36);
          break;

        /*
         * INICIO GRAFICAS ETAD
         */
        case 44:
          this.time_await = 5000;
          break;
        case 45:
          this.buildChartTrimestral(1);
          break;
        case 46:
          this.buildChartAnual(0);
          break;
        /*
         * Inicio presentación KPI
         */
        case 47:
          //case 47 solo para mostrar imagen de ETAD
          let idEtad = this.getIdEtad(this.auxIndexETAD);
          this.imageEtadPresentation = this.imageEtadPresentation.replace(/:idEtad:/, idEtad);

          this.time_await = 5000;
          /*
           * Calcular total de pasos que existiran para 
           * mostrar las graficas de KPI
           */
          let cantidad_pasos_KPI = 0;
          this.KPI.map((el) => {
            let tmp = parseInt("" + (el.length) / 3);
            if (el.length % 3 != 0) {
              tmp += 1;
            }
            cantidad_pasos_KPI += tmp;
          });

          this.TOTAL += cantidad_pasos_KPI;

          /*
           * Fin calculo
           */
          break;
        default:

          if (this.steep_index > 47 && this.steep_index < this.TOTAL) {

            let kpi_etad = this.KPI[this.auxIndexETAD];
            let pasos_etad = 0;
            let tmp = parseInt("" + (kpi_etad.length) / 3);
            if (kpi_etad.length % 3 != 0) {
              tmp += 1;
            }
            pasos_etad += (tmp + 47);


            if (this.steep_index > pasos_etad) {
              this.finishPresentationEtad = true;
            } else {
              //Construye las graficas correspondientes
              this.buildChartKPI(this.auxIndexKPI, this.auxIndexETAD);
            }

          }

      }

      //Ejecuta evento de animación
      setTimeout(() => {
        this.status = 'active';
        this.type_animation = 'enfasis';
      }, 200);

    }, 200);

  }

  buildChartPerdida(position_data: number): void {
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

  buildChartDisponiblidad(position_data: number): void {
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

  buildChartOEE(position_data: number): void {
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

  buildChartJucodi(position_data: number): void {
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

  buildChartRealvsPlanBarras(position_data: number): void {
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

  buildChartSpider(position_data: number): void {
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

  buildChartVelocidad(position_data: number): void {
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

  buildChartPoliolefinas(position_data: number): void {
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


  buildChartTrimestral(position_data: number): void {
    let configuracion = clone(configTrimestral);
    this.time_await = 10000;
    let datos = this.POSICION[position_data];
    /*
     * Proceso para asignar el color de la barra
     */

    let lugar = 0;
    datos.forEach((element, index, arg) => {
      if (index > 0) {

        if (element.valor < arg[index - 1].valor) {
          if (lugar < 4) lugar++;
        }

        switch (lugar) {
          case 1:
            element.color = "#1b5e20";
            break;
          case 2:
            element.color = "#ffd600";
            break;
          case 3:
            element.color = "#827717";
            break;
          case 4:
            element.color = "#b71c1c";
            break;

        }

      } else if (index == 0) {
        lugar = 1;
        element.color = "#1b5e20";
      }
    });

    /*
     * Fin del proceso
     */

    let data = [];

    datos.map(el => {
      data.push({ y: el.valor, color: el.color });
    });

    let etiquetas = datos.map(el => el.name);
    let colores = datos.map(el => el.color);

    configuracion.series = [];
    configuracion.xAxis.categories = etiquetas;
    configuracion.colors = colores;
    configuracion.series.push({ name: ' Calificación ', data: data });

    configuracion.title.text = 'Posición trimestral';

    $('#grafica').highcharts(configuracion);

  }

  buildChartAnual(position_data: number): void {
    let configuracion = clone(configAnual);
    this.time_await = 10000;
    let datos = this.POSICION[position_data];
    /*
     * Proceso para asignar el color de la barra
     */

    let lugar = 0;
    datos.forEach((element, index, arg) => {
      if (index > 0) {

        if (element.valor < arg[index - 1].valor) {
          if (lugar < 4) lugar++;
        }

        switch (lugar) {
          case 1:
            element.color = "#1b5e20";
            break;
          case 2:
            element.color = "#ffd600";
            break;
          case 3:
            element.color = "#827717";
            break;
          case 4:
            element.color = "#b71c1c";
            break;

        }

      } else if (index == 0) {
        lugar = 1;
        element.color = "#1b5e20";
      }
    });

    /*
           * Fin del proceso
           */

    let data = [];

    datos.map(el => {
      data.push({ y: el.valor, color: el.color });
    });

    let etiquetas = datos.map(el => el.name);
    let colores = datos.map(el => el.color);

    configuracion.series = [];
    configuracion.xAxis.categories = etiquetas;
    configuracion.colors = colores;
    configuracion.series.push({ name: ' Calificación ', data: data });

    configuracion.title.text = 'Posición Anual';

    $('#grafica').highcharts(configuracion);

  }

  buildChartKPI(indiceKPI: number, indiceETAD: number): void {

    this.time_await = 15000;
    this.row = [];

    let datos = this.KPI[indiceETAD].filter((el, index) => {

      if (index >= indiceKPI && index < (indiceKPI + 3)) {
        return el;
      }
    });

    datos.map((el, index, arg) => {

      let config_grafica = clone(configKPI);
      let dataReal = [el.metaA, el.metaB, el.metaC, el.metaD];
      let dataEsperada = [el.resultadoA, el.resultadoB, el.resultadoC, el.resultadoD];

      config_grafica.series = [];
      config_grafica.xAxis.categories = ['A', 'B', 'C', 'D'];
      config_grafica.title.text = el.kpi;

      config_grafica.series.push({ name: ' Logro ', data: dataEsperada, color: '#dcedc8' });
      config_grafica.series.push({ name: ' Meta ', data: dataReal, type: 'line', color: '#1a237e' });

      this.row.push(config_grafica);

    });

    setTimeout(() => {
      this.row.forEach((grafica, i) => {
        $('#grafica' + i).highcharts(grafica);
      });
    }, 70)


  }

  getIdEtad(indice: number): string {
    if (this.KPI[indice][0]) {
      return "" + this.KPI[indice][0].id_etad;
    } else {
      return "no_identificado";
    }

  }



}
