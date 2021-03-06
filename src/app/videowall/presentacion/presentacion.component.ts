import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { PetReporteEnlace } from '../../models/pet-reporte-enlace';
import { configChart as configPerdidas } from '../../oee/rpt-fuente-perdidas/rpt.config.export';
import { configChart as configDisponiblidad } from '../../oee/rpt-disponibilidad/rpt.config.export';
import { configChart as configOEE } from '../../oee/rpt-oee/rpt.config.export';
import { configChart as configJucodi } from '../../oee/rpt-jucodi/rpt.config.export';
import { configChart as configRealPlan, configChartSpider } from '../../oee/rpt-produccion-real-plan/rpt.config.export';
import { configChartSpider as configVelocidad } from '../../oee/rpt-velocidad-promedio/rpt.config.export';
import { configChart as configAnual } from '../../etad/rpt-posicion-anual/rpt.config.export';
import { configChart as configTrimestral } from '../../etad/rpt-posicion-trimestral/rpt.config.export';
import { configChart as configKPI } from '../../etad/rpt-graficas-kpi/rpt.config.export';
import { clone, formatDecimal } from '../../utils';
import {
  ANIMATION_PRELOADER,
  ANIMATION_REPORTE,
  EFECTS_ENFASIS,
  AnimationPlayer,
  AnimationBuilder
} from './presentacion.animaciones';

declare var $: any;
declare var Materialize: any;
@Component({
  selector: 'app-presentacion',
  templateUrl: './presentacion.component.html',
  styleUrls: ['./presentacion.component.css'],
  animations: [ANIMATION_PRELOADER, ANIMATION_REPORTE]
})
export class PresentacionComponent implements OnInit {

  @ViewChild('formato') rpt_enlace: ElementRef;
  
  private TOTAL: number;
  public type_animation: string;
  public steep_index: number; //Controla la secuencia de las graficas
  public loading: boolean;
  public isOk: boolean;
  public OEE: any;
  public KPI: any;
  public POSICION: any;
  public ENLACE_OBJ: any;
  public status: string;
  public statusRpt: string;
  public height: number;
  public endVideoWall: boolean;
  public hidden_actions: boolean;
  public play: boolean;
  public disabled_btn_play:boolean;
  private player: AnimationPlayer;
  /*
   * Variables auxiliares para mostrar KPI
   */
  public imageEtadPresentation: string;
  public auxIndexETAD: number;
  public finishPresentationEtad: boolean;
  public cantidad_pasos_KPI: number;
  public row: Array<any>;
  public review: boolean;
  public auxIndexKPI: number;
  /*
   * Fin variables auxiliares de KPI'S
   */

  /*
   * Variable para auxiliares reporte de enlace
   */
  public datos_formato: PetReporteEnlace;
  public existRptEnlace: boolean;
  /*
   * Fin variables auxiliares reporte enlace
   */
  public time_await: number; // tiempo en milisegundos

  constructor(private builder: AnimationBuilder) { }

  ngOnInit() {
    this.initializeComponent();
  }

  initializeComponent() {
    this.loading = true;
    this.play = true;
    this.disabled_btn_play = true;
    this.hidden_actions = true;
    this.type_animation = 'entrada';
    this.cantidad_pasos_KPI = 0;
    this.steep_index = 0;
    this.time_await = 4000;
    this.isOk = false;
    this.endVideoWall = false;
    this.existRptEnlace = false;
    this.auxIndexETAD = 0;

    this.auxIndexKPI = -3;
    this.finishPresentationEtad = false;
    this.imageEtadPresentation = 'assets/videowall_etad_id_:idEtad:.png';
    this.row = [];
    this.OEE = localStorage.getItem('OEE');
    this.KPI = localStorage.getItem('KPI');
    this.POSICION = localStorage.getItem('POSICION');
    this.ENLACE_OBJ = localStorage.getItem('ENLACE_OBJ');


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


      // Sumar un paso mas si existe reporte de enlace de objetivos

      if (this.ENLACE_OBJ) {
        this.datos_formato = JSON.parse(this.ENLACE_OBJ);
        this.existRptEnlace = true;
      } else {
        this.existRptEnlace = false;
      }


      this.TOTAL = this.OEE.length + this.POSICION.length + 8; // Se suma " 8 " la cantidad de diapositivas de presentacion 

      this.isOk = true;
      this.loading = false;
      // Tiene los datos para poder trabajar 
      this.status = 'inactive';
      this.statusRpt = 'inactive';
      setTimeout(()=>{
        this.disabled_btn_play = false;
      },200)
    }
  }

  animationDone(event: any): void {
    if (this.play) {
      setTimeout(() => {
        
        switch (this.type_animation) {
          case 'entrada':

            if (this.steep_index > 1 || this.steep_index == -1) {
              this.buildChart(this.steep_index);
            } else {
              this.status = 'active';
              this.type_animation = 'enfasis';
            }
            break;
          case 'enfasis':
            setTimeout(() => {
              if (this.play) {
                const EFECT_RANDOM = Math.floor(Math.random() * EFECTS_ENFASIS.length);
                this.status = EFECTS_ENFASIS[EFECT_RANDOM];
                this.type_animation = 'salida';
              }
            }, this.time_await);
            break;
          case 'salida':
            setTimeout(() => {
              if (this.play) {
                this.status = 'inactive';
                this.type_animation = 'fin';
              }
            }, 1000);
            break;
          case 'fin':


            if (this.steep_index == 46) {
              /*
              * Calcular total de pasos que existiran para 
              * mostrar las graficas de KPI
              */
              this.cantidad_pasos_KPI = 0;
              if (this.KPI.length > 0) {

                let kpis = this.KPI[this.auxIndexETAD];

                let tmp = parseInt("" + (kpis.length) / 3);
                if (kpis.length % 3 != 0) {
                  tmp += 1;
                }

                this.cantidad_pasos_KPI = tmp;
              }

              /*
              * Fin calculo
              */
            }

            if (this.steep_index < (this.TOTAL + this.cantidad_pasos_KPI)) {
              setTimeout(() => {
                if (!this.endVideoWall) {

                  if ((this.steep_index + 1) >= 47) {

                    if (this.KPI.length > 0) {
                      this.steep_index = this.steep_index + 1;
                      this.status = 'inactive';
                      this.type_animation = 'entrada';

                      if (this.steep_index > 47 && this.steep_index <= (this.TOTAL + this.cantidad_pasos_KPI)) {
                        this.review = false;
                        this.auxIndexKPI = this.auxIndexKPI + 3;
                        setTimeout(() => {
                          this.review = true;
                        }, 15);
                      }

                    } else {

                      // Entra si termina OEE y no existen KPI.
                      if (this.existRptEnlace) {
                        // Entonces muestra reporte de enlace si existe
                        this.steep_index = -1;
                        setTimeout(() => {
                          this.statusRpt = 'active';
                        }, 200);
                      } else {
                        // Si no existe reporte finaliza presentacion
                        this.initializeComponent();
                      }
                    }
                  } else {
                    if (this.steep_index != -1) {
                      this.steep_index = this.steep_index + 1;
                      this.status = 'inactive';
                      this.type_animation = 'entrada';
                    }

                  }

                }


              }, 200);
            } else {
              this.imageEtadPresentation = 'assets/videowall_etad_id_:idEtad:.png';
              this.steep_index = 47
              this.status = 'inactive';
              this.type_animation = 'entrada';
              this.auxIndexETAD++;
              this.auxIndexKPI = -3;

            }

            if (this.KPI.length > 0) {

              if (this.auxIndexETAD == this.KPI.length) {

                if (this.existRptEnlace) {
                  this.steep_index = -1;
                  setTimeout(() => {
                    this.statusRpt = 'active';
                  }, 200);
                } else {
                  this.initializeComponent();
                }
              }

            }

            break;
        }

      }, 200);
    }
  }

  buildChart(steep: number) {
    //setTimeout time para construir grafica

    setTimeout(() => {
      switch (steep) {
        /*
         * Portada
         */
        case 1:
          this.time_await = 4000;
          break;
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
          if (this.KPI.length > 0) {
            let idEtad = this.getIdEtad(this.auxIndexETAD);
            this.imageEtadPresentation = this.imageEtadPresentation.replace(/:idEtad:/, idEtad);

            this.time_await = 5000;
            /*
            * Calcular total de pasos que existiran para 
            * mostrar las graficas de KPI
            */

            this.cantidad_pasos_KPI = 0;
            let kpis = this.KPI[this.auxIndexETAD];

            let tmp = parseInt("" + (kpis.length) / 3);
            if (kpis.length % 3 != 0) {
              tmp += 1;
            }

            this.cantidad_pasos_KPI = tmp;

            /*
            * Fin calculo
            */
          }
          break;
        default:

          if (this.steep_index > 47) {
            //Construye las graficas correspondientes
            this.buildChartKPI(this.auxIndexKPI, this.auxIndexETAD);
          }

      }

      //Ejecuta evento de animación
      setTimeout(() => {
        this.status = 'active';
        this.type_animation = 'enfasis';
      }, 200);

    }, 200);

  }

  animationDoneRpt(event: any): void {
    this.disabled_btn_play = true;
    if (this.statusRpt == 'active') {
      setTimeout(() => {
        this.statusRpt = 'desplazarY';
      }, 1000)
    } else if (this.statusRpt == 'desplazarY') {
      this.initializeComponent();
    }
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
    configuracion.plotOptions.series.dataLabels.style.fontSize='14px';
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
    configuracion.title.style.color = '#0d47a1';
    let esperada = [];
    let real = [];
    let legeng = '<p style="font-size: 1.3em;">:grupo:</p><br><span style="color:#6D6414;font-size: 1.3em;">:real:</span><br><span style="color:#283593;font-size: 1.3em;">:meta:</span>';

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
    categorias.push(legeng.replace(':grupo:', 'Grupo A').replace(':real:', formatDecimal(realTmp.reala, 3)).replace(':meta:', formatDecimal(realTmp.metaa, 3)));
    categorias.push(legeng.replace(':grupo:', 'Grupo B').replace(':real:', formatDecimal(realTmp.realb, 3)).replace(':meta:', formatDecimal(realTmp.metab, 3)));
    categorias.push(legeng.replace(':grupo:', 'Grupo C').replace(':real:', formatDecimal(realTmp.realc, 3)).replace(':meta:', formatDecimal(realTmp.metac, 3)));
    categorias.push(legeng.replace(':grupo:', 'Grupo D').replace(':real:', formatDecimal(realTmp.reald, 3)).replace(':meta:', formatDecimal(realTmp.metad, 3)));

    configuracion.xAxis.categories = categorias;

    configuracion.series.push({
      color: '#283593',
      name: '<p style="font-size: 1.3em;color:#283593""> Meta </p>',
      data: esperada,
      pointPlacement: 'on',
      dataLabels: {
        color: '#1a237e'
      }
    });

    configuracion.series.push({
      color: '#6D6414',
      name: '<p style="font-size: 1.3em;color:#6D6414"> Real </p>',
      data: real,
      pointPlacement: 'on',
      dataLabels: {
        y: 5,
        color: '#6D6414'
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
    configuracion.title.x = -300;
    configuracion.title.y = 50;

    configuracion.xAxis.categories.push('<p style="font-size: 1.3em;">GRUPO A</p><br><b style="font-size: 1.5em;">' + formatDecimal(esperadaTmp.sppeda, 3) + '</b>');
    configuracion.xAxis.categories.push('<p style="font-size: 1.3em;">GRUPO B</p><br><b style="font-size: 1.5em;">' + formatDecimal(esperadaTmp.sppedb, 3) + '</b>');
    configuracion.xAxis.categories.push('<p style="font-size: 1.3em;">GRUPO C</p><br><b style="font-size: 1.5em;">' + formatDecimal(esperadaTmp.sppedc, 3) + '</b>');
    configuracion.xAxis.categories.push('<p style="font-size: 1.3em;">GRUPO D</p><br><b style="font-size: 1.5em;">' + formatDecimal(esperadaTmp.sppedd, 3) + '</b>');


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
    configuracion.series.push({ name: ' Meta 1ro ', data: dataMeta1, type: 'line', color: '#b71c1c', dashStyle: 'Dash' });
    configuracion.series.push({ name: ' Meta 2do ', data: dataMeta2, type: 'line', color: '#1a237e', dashStyle: 'Dash' });
    configuracion.series.push({ name: ' Meta dia ', data: dataMeta3, type: 'line', color: '#736914', dashStyle: 'Dash' });

    $('#grafica').highcharts(configuracion);
  }


  buildChartTrimestral(position_data: number): void {
    let configuracion = clone(configTrimestral);
    configuracion.exporting.enabled = false;
    configuracion.chart.height = this.height;
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
    configuracion.exporting.enabled = false;
    configuracion.chart.height = this.height;
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


  actionVideoWall(): void {
    this.disabled_btn_play = true;
    this.play = !this.play;

    if (this.play) {
      this.animationDone(null);
      Materialize.toast('Reproduciendo', 1000, 'green');
    }else{
 
      Materialize.toast('Presentación pausada', 1000, 'red');
    }
    setTimeout(()=>{
      this.disabled_btn_play = false;
    },1000);
  }

  optionsVideoWall(param: string): void {
    this.hidden_actions = ('leave' == param);
  }



}
