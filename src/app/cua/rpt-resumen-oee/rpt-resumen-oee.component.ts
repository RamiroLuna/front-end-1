import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { RptResumenOeeService } from "./rpt-resumen-oee.service";
import { Linea } from '../../models/linea';
// import * as Chart from 'chart.js';
import { AuthService } from '../../auth/auth.service';
import { Periodo } from '../../models/periodo';
import { getTablaUtf8 } from '../../utils';
import * as pdfMake from 'pdfmake/build/pdfmake.js';
import * as pdfFonts from 'pdfmake/build/vfs_fonts.js';
pdfMake.vfs = pdfFonts.pdfMake.vfs;


declare var $: any;
declare var Materialize: any;

@Component({
  selector: 'app-rpt-resumen-oee',
  templateUrl: './rpt-resumen-oee.component.html',
  providers: [RptResumenOeeService]
})
export class RptResumenOeeComponent implements OnInit {
  public loading: boolean;
  public submitted: boolean;
  public viewReport: boolean;
  public formConsultaPeriodo: FormGroup;
  public paramsBusqueda: any;
  public lineas: Array<Linea>;
  public tituloGraficaOEE: string;
  public tituloGraficaDisponi: string;
  public tituloGraficaPerdida: string;

  public texto_link: string;
  public seccion: number;
  public ver_tabla: boolean;
  public rows: Array<any>;

  public anios: Array<any>;
  public meses: Array<any>;
  public periodos: Array<Periodo>;
  public rowsProduccion: Array<any>;
  public rowsPerdidas: Array<any>;
  public rowsDisponibilidad: Array<any>;

  /** Variables para contener el grafico */
  public chartsOee: any;
  public chartDisponibilidad: any;
  public chartsPerdidas: any;

  /** Configuracion grafica OEE */
  public options: any = {
    scales: {
      xAxes: [{

        ticks: {
          callback: function (value, index, values) {
            return value;
          }
        }, scaleLabel: {
          display: false,
          labelString: '',
        }
      }],
      yAxes: [{
        ticks: {
          beginAtZero: true,
          callback: function (value, index, values) {
            return value + '%';
          }
        },
        scaleLabel: {
          display: false,
          labelString: '%',
        }
      }]
    },
    legend: {
      display: true,
    },
    title: {
      display: true,
      text: '',
      fontColor: '#303f9f',
      fontStyle: 'normal',
      fontSize: 16
    },
    animation: {
      duration: 1000,
      easing: 'easeInQuad'
    },
    responsive: true
  };


  public data: any = {
    labels: [],
    datasets: [
      {
        label: '',
        type: 'line',
        data: []
      }, {
        label: '',
        data: [],
        backgroundColor: 'rgba(102,187,106)',
        borderColor: 'rgba(56,142,60)',
        borderWidth: 1
      }]
  };

  /** Configuracion grafica disponibilidad */

  public optionsDisponibilidad: any = {
    scales: {
      xAxes: [{

        ticks: {
          callback: function (value, index, values) {
            return value + 'Hrs';
          }
        }, scaleLabel: {
          display: false,
          labelString: 'Horas',
        }
      }],
      yAxes: [{
        ticks: {
          beginAtZero: true
        },
        scaleLabel: {
          display: false,
        }
      }]
    },
    legend: {
      display: true
    },
    title: {
      display: true,
      text: '',
      fontColor: '#303f9f',
      fontStyle: 'normal',
      fontSize: 16
    },
    animation: {
      duration: 1000,
      easing: 'easeInQuad'
    },
    responsive: true
  };


  public dataDisponibilidad: any = {
    labels: [],
    datasets: [{
      label: '',
      data: [],
      backgroundColor: 'rgba(205,220,57)',
      borderColor: 'rgba(130,119,23)',
      borderWidth: 1
    }]
  };

  /** Configuracion grafica perdidas */

  public optionsPerdidas: any = {
    scales: {
      xAxes: [{

        ticks: {
          autoSkip: false
        }, scaleLabel: {
          display: true,
          labelString: 'Horas',
        }
      }],
      yAxes: [{
        ticks: {
          beginAtZero: true
        },
        scaleLabel: {
          display: false,
          // labelString: '%',
        }
      }]
    },
    legend: {
      display: false,
    },
    title: {
      display: true,
      text: '',
      fontColor: '#303f9f',
      fontStyle: 'normal',
      fontSize: 16
    },
    animation: {
      duration: 1000,
      easing: 'easeInQuad'
    },
    responsive: true
  };


  public dataPerdidas: any = {
    labels: [],
    datasets: [{
      label: '',
      data: [],
      backgroundColor: 'rgba(255, 99, 132, 0.2)',
      borderColor: 'rgba(255,99,132,1)',
      borderWidth: 1
    }]
  };

  constructor(
    private service: RptResumenOeeService,
    private auth: AuthService,
    private fb: FormBuilder) { }

  ngOnInit() {

    this.loading = true;
    this.submitted = false;
    this.viewReport = false;
    this.ver_tabla = false;
    this.rows = [];
    this.rowsPerdidas = [];
    this.rowsDisponibilidad = [];
    this.rowsProduccion = [];
    this.seccion = 0;
    this.tituloGraficaOEE = "";
    this.tituloGraficaPerdida = "";
    this.tituloGraficaDisponi = "";
    this.texto_link = "Ver datos en tabla";
    this.paramsBusqueda = {};
    this.anios = [];
    this.meses = [];
    this.periodos = [];

    this.service.getCatalogos(this.auth.getIdUsuario()).subscribe(result => {

      if (result.response.sucessfull) {
        this.lineas = result.data.listLineas || [];
        this.lineas = this.lineas.filter(el => el.id_linea != 6).map(el => el);

        this.periodos = result.data.listPeriodos || [];
        let tmpAnios = this.periodos.map(el => el.anio);
        this.periodos.filter((el, index) => {
          if (tmpAnios.indexOf(el.anio) === index) {
            this.anios.push({ valor: el.anio });
          }
        });

        this.loading = false;
        this.loadFormulario();

        setTimeout(() => { this.ngAfterViewHttp(); }, 200)
      } else {

        this.loading = false;
        Materialize.toast(result.response.message, 4000, 'red');
      }
    }, error => {

      this.loading = false;
      Materialize.toast('Ocurrió un error en el servicio!', 4000, 'red');
    });


  }

  loadFormulario(): void {
    this.formConsultaPeriodo = this.fb.group({
      idLinea: new FormControl({ value: this.paramsBusqueda.idLinea }, [Validators.required]),
      anio: new FormControl({ value: this.paramsBusqueda.anio }, [Validators.required]),
      idPeriodo: new FormControl({ value: this.paramsBusqueda.idPeriodo }, [Validators.required])
    });
  }

  /*
   * Carga plugins despues de cargar y mostrar objetos en el DOM cuando carga la pagina
   */
  ngAfterViewHttp(): void {
    $('.tooltipped').tooltip({ delay: 50 });
    $('select').material_select();
  }

  /*
   * Carga plugins para mostrar grafica 
   */
  ngAfterViewHttpRpt(): void {

    let ctxDispo = $('#chartDisponibilidad').get(0).getContext('2d');
    // this.chartDisponibilidad = new Chart(ctxDispo, {
    //   type: 'horizontalBar',
    //   data: this.dataDisponibilidad,
    //   options: this.optionsDisponibilidad
    // });

    $('.carousel.carousel-slider').carousel({
      fullWidth: true,
      indicators: true,
      onCycleTo: (ele, dragged) => {
        this.texto_link = "Ver datos en tabla(s)";
        this.ver_tabla = false;
        this.seccion = $(ele).index();
        $('.carousel li').css('background-color', '#bdbdbd');
        $('.carousel .indicators .indicator-item.active').css('background-color', '#757575');

        switch (this.seccion) {
          case 0:
            // this.options.animation= true;
            let ctx = $('#chart').get(0).getContext('2d');
            // this.chartsOee = new Chart(ctx, {
            //   type: 'bar',
            //   data: this.data,
            //   options: this.options
            // });

            break;
          case 1:

            let ctxDispo = $('#chartDisponibilidad').get(0).getContext('2d');
            // this.chartDisponibilidad = new Chart(ctxDispo, {
            //   type: 'horizontalBar',
            //   data: this.dataDisponibilidad,
            //   options: this.optionsDisponibilidad
            // });

            break;
          case 2:

            // let ctx1 = $('#chartPerdidas').get(0).getContext('2d');
            // this.chartsPerdidas = new Chart(ctx1, {
            //   type: 'horizontalBar',
            //   data: this.dataPerdidas,
            //   options: this.optionsPerdidas
            // });
            break;
        }
      }
    });

    $('.carousel li').css('background-color', '#bdbdbd');
    $('.carousel .indicators .indicator-item.active').css('background-color', '#757575');
  }

  /*
   * Carga plugins para mostrar grafica 
   */
  ngAfterViewHttpRptPerdida(): void {
    let ctx = $('#chartPerdidas').get(0).getContext('2d');
    // this.chartsPerdidas = new Chart(ctx, {
    //   type: 'horizontalBar',
    //   data: this.dataPerdidas,
    //   options: this.optionsPerdidas
    // }
    // );
  }


  verTablas(event): void {
    event.preventDefault();
    this.ver_tabla = !this.ver_tabla;
    this.texto_link = this.ver_tabla ? "Ocultar tabla(s)" : "Ver datos en tabla(s)";
  }


  agregar() {
    $('.tooltipped').tooltip('hide');
  }

  regresar() {
    $('.tooltipped').tooltip('hide');
  }


  changeCombo(params: string): void {
    this.viewReport = false;
    if (params == 'anio') {
      this.meses = this.periodos.filter(el => el.anio == this.paramsBusqueda.anio)
    }
  }

  busqueda(parametrosBusqueda: any) {
    this.viewReport = false;
    this.submitted = true;

    if (this.formConsultaPeriodo.valid) {

      this.service.getOEE(this.auth.getIdUsuario(), parametrosBusqueda).subscribe(result => {
     
        if (result.response.sucessfull) {

          /** Grafica para OEE */
          this.tituloGraficaOEE = "OEE de  " + this.getTextoLinea(this.lineas, parametrosBusqueda.idLinea) + this.getPeriodo(this.periodos, parametrosBusqueda.idPeriodo);
          this.options.title.text = this.tituloGraficaOEE;
          this.rows = result.data.reporteOEE || [];
          let meta_esperada = this.rows.filter((el) => el.padre == 0).map((el) => el.meta);
          let labels = this.rows.filter((el) => el.padre == 0).map((el) => el.titulo);
          let horas = this.rows.filter((el) => el.padre == 0).map((el) => el.porcentaje);

          this.data.labels = labels;
          this.data.datasets[1].label = 'OEE';
          this.data.datasets[1].data = horas;

          this.data.datasets[0].label = 'Meta esperada';
          this.data.datasets[0].data = meta_esperada;

          /**  Grafica para Disponiblidad */

          this.tituloGraficaDisponi = "Disponibilidad de " + this.getTextoLinea(this.lineas, parametrosBusqueda.idLinea) + this.getPeriodo(this.periodos, parametrosBusqueda.idPeriodo);
          this.optionsDisponibilidad.title.text = this.tituloGraficaDisponi;
          this.rowsDisponibilidad = result.data.reporteDisponibilidad || [];
          this.rowsProduccion = result.data.datosProduccion || [];
          let labelsDisponibilidad = this.rowsDisponibilidad.filter((el) => el.padre == 0).map((el) => el.titulo);
          let horasDisponibilidad = this.rowsDisponibilidad.filter((el) => el.padre == 0).map((el) => el.hrs);

          this.dataDisponibilidad.labels = labelsDisponibilidad;
          this.dataDisponibilidad.datasets[0].label = 'Horas';
          this.dataDisponibilidad.datasets[0].data = horasDisponibilidad;


          this.viewReport = true;
          setTimeout(() => { this.ngAfterViewHttpRpt(); }, 200);

        } else {

          this.viewReport = false;
          Materialize.toast(result.response.message, 4000, 'red');
        }
      }, error => {

        this.viewReport = false;
        Materialize.toast('Ocurrió un error en el servicio!', 4000, 'red');
      });
    } else {
      this.viewReport = false;
      Materialize.toast('Ingrese todos los datos para mostrar reporte!', 4000, 'red');
    }

    this.service.getOEEFallasByLinea(this.auth.getIdUsuario(), parametrosBusqueda).subscribe(result => {
     
      if (result.response.sucessfull) {
        this.tituloGraficaPerdida = "Fuente de perdidas de  " + this.getTextoLinea(this.lineas, parametrosBusqueda.idLinea) + this.getPeriodo(this.periodos, parametrosBusqueda.idPeriodo);;
        this.optionsPerdidas.title.text = this.tituloGraficaPerdida;
        this.rowsPerdidas = result.data.listaOEEFallas || [];
        let labels = this.rowsPerdidas.filter((el) => el.padre == 0).map((el) => el.fuente);
        let horas = this.rowsPerdidas.filter((el) => el.padre == 0).map((el) => el.hrs);

        this.dataPerdidas.labels = labels;
        this.dataPerdidas.datasets[0].label = 'Horas Muertas';
        this.dataPerdidas.datasets[0].data = horas;

        setTimeout(() => { this.ngAfterViewHttpRptPerdida(); }, 200);

      } else {
        // Materialize.toast(result.response.message, 4000, 'red');
      }
    }, error => {
      // Materialize.toast('Ocurrió un error en el servicio!', 4000, 'red');
    });

  }

  getTextoLinea(lineas: Array<Linea>, id_linea: number): string {
    let el = lineas.filter(el => el.id_linea == id_linea);

    if (el.length > 0) {
      return el[0].descripcion;
    } else {
      return "Linea no identificada"
    }
  }

  downloadCharts(event): void {
    event.preventDefault();
    let img = document.createElement('a');

    if (this.seccion == 0) {
      let canvas = $('#chart');
      let data = canvas[0].toDataURL("image/png");

      img.setAttribute("id", "tmpImagen");
      img.href = data;
      img.download = "Grafica_fallas";

    } else if (this.seccion == 1) {
      let canvas = $('#chartDisponibilidad');
      let data = canvas[0].toDataURL("image/png");

      img.setAttribute("id", "tmpImagen");
      img.href = data;
      img.download = "Grafica_disponibilidad";
    } else if (this.seccion == 2) {
      let canvas = $('#chartPerdidas');
      let data = canvas[0].toDataURL("image/png");

      img.setAttribute("id", "tmpImagen");
      img.href = data;
      img.download = "Graficas_perdidas";

    }

    img.click();
    img.remove();

  }

  exportarExcel(): void {
    let linkFile = document.createElement('a');
    let data_type = 'data:application/vnd.ms-excel;';

    if (this.seccion == 0) {
      let tabla = getTablaUtf8('tblReporte');
      linkFile.href = data_type + ', ' + tabla;
      linkFile.download = 'ReporteOEE';
    } else if (this.seccion == 1) {
      let tablas = getTablaUtf8('tblReporteDisponibilidad') + getTablaUtf8('tblReporteProduccion');
      linkFile.href = data_type + ', ' + tablas;
      linkFile.download = 'ReporteDisponibilidad';
    } else if (this.seccion == 2) {
      let tabla = getTablaUtf8('tblReportePerdidas');
      linkFile.href = data_type + ', ' + tabla;
      linkFile.download = 'ReporteDeFallas';
    }

    linkFile.click();
    linkFile.remove();

  }

  getPeriodo(periodos: Array<Periodo>, id_periodo: number): string {
    let el = periodos.filter(el => el.id_periodo == id_periodo);

    if (el.length > 0) {
      return " " + el[0].descripcion_mes + " " + el[0].anio;
    } else {
      return "Linea no identificada"
    }
  }

  exportarTodoToExcel(): void {

    let linkFile = document.createElement('a');
    let data_type = 'data:application/vnd.ms-excel;';
    let tablas = getTablaUtf8('tblReporte') +
      getTablaUtf8('tblReporteDisponibilidad') +
      getTablaUtf8('tblReporteProduccion') +
      getTablaUtf8('tblReportePerdidas');

    linkFile.href = data_type + ', ' + tablas;
    linkFile.download = 'RptGlobalEficiencia';
    linkFile.click();
    linkFile.remove();

  }


  printRptPDF(): void {

    let docDefinition = {
      header: (currentPage, pageCount) => {
        // you can apply any logic and return any valid pdfmake element
        let texto = 'Eficiencia Global de los equipos.  ' +
          '  Linea:' + this.getTextoLinea(this.lineas, this.paramsBusqueda.idLinea) +
          '     Periodo:' + this.getPeriodo(this.periodos, this.paramsBusqueda.idPeriodo);

        return { text: texto, alignment: 'center', margin: 40, color: '#1a237e', bold: true, fontSize: 14 };
      },
      content: [
        {
          columns: [
            {
              width: '30%',
              layout: 'noBorders',
              table: {
                widths: ['*'],
                body: [
                  [''],
                  [''],
                  [''],
                  [''],
                  [''],
                  [''],
                  [''],
                  [''],
                  [
                    {
                      table: {
                        headerRows: 1,
                        widths: ['*', 'auto', 'auto'],
                        body: this.getTableHtmlToArray(this.rows, 'oee')
                      }
                    }
                  ],
                  [''],
                  [''],
                  [''],
                  [''],
                  [''],
                  [''],
                  [''],
                  [''],
                  [''],
                  [''],
                  [
                    {
                      table: {
                        headerRows: 1,
                        widths: ['*', 'auto', 'auto'],
                        body: this.getTableHtmlToArray(this.rowsDisponibilidad, 'disponibilidad')
                      }
                    }
                  ],
                  [''],
                  [''],
                  [''],
                  [''],
                  [''],
                  [''],
                  [''],
                  [''],
                  [''],
                  [''],
                  [''],
                  [
                    {
                      table: {
                        headerRows: 1,
                        widths: ['*', 'auto'],
                        body: this.getTableHtmlToArray(this.rowsProduccion, 'produccion')
                      }
                    }
                  ],
                  [''],
                  [''],
                  [''],
                  [''],
                  [''],
                  [''],
                  [''],
                  [''],
                  [''],
                  [''],
                  [''],
                  [''],
                  [''],
                  [''],
                  [''],
                  [
                    {
                      table: {
                        headerRows: 1,
                        widths: ['*', 'auto', 'auto'],
                        body: this.getTableHtmlToArray(this.rowsPerdidas, 'perdidas')
                      }
                    }
                  ]
                ]
              }
            },
            {
              width: '70%',
              layout: 'noBorders',
              table: {
                widths: ['*'],
                body: [
                  [{ text: '\n' }],
                  [{ image: this.chartsOee.toBase64Image(), width: 700, height: 250 }],
                  [{ text: '\n\n\n\n\n\n' }],
                  [{ image: this.chartDisponibilidad.toBase64Image(), width: 700, height: 250 }],
                  [{ image: this.chartsPerdidas.toBase64Image(), width: 700, height: 350 }]
                ]
              }
            }
          ],
          // optional space between columns
          columnGap: 10
        }
      ],
      styles: {
        header: {
          color: "#FFFFFF",
          bold: true,
          fillColor: '#7cb342'
        },
        subheader:{
          color: "#000000",
          bold: true,
          fillColor: '#f1f8e9'
        }
      },
      // a string or { width: number, height: number }
      pageSize: 'TABLOID',
      // by default we use portrait, you can change it to landscape if you wish
      pageOrientation: 'landscape',

      // [left, top, right, bottom] or [horizontal, vertical] or just a number for equal margins
      pageMargins: [40, 70, 40, 60]
    };

    pdfMake.createPdf(docDefinition).open();

  }

  getTableHtmlToArray(filas: Array<any>, type: string): Array<any> {
    let datos = [];
    let header = [];
    switch (type) {
      case 'oee':
        header = [];
        header.push({ text: 'OEE', style: 'header' });
        header.push({ text: '', style: 'header' });
        header.push({ text: 'Real', style: 'header' });
        datos.push(header);
        break;
      case 'disponibilidad':
        header = [];
        header.push({ text: 'Tiempo', style: 'header' });
        header.push({ text: 'Hrs', style: 'header' });
        header.push({ text: '%', style: 'header' });
        datos.push(header);
        break;
      case 'produccion':
        header = [];
        header.push({ text: 'Datos producción', style: 'header', colSpan: 2 });
        header.push({});
        datos.push(header);
        break;

      case 'perdidas':
        header = [];
        header.push({ text: 'Fuentes de perdidas', style: 'header' });
        header.push({ text: 'Hrs', style: 'header' });
        header.push({ text: '%', style: 'header' });
        datos.push(header);
        break;
    }

    if (type == 'oee' || type == 'disponibilidad') {

      filas.filter(el => el.padre != 1).forEach(el => {
        let tmp = [];
        if (el.padre == 0) {
          tmp.push('' + el.titulo);
          tmp.push('' + el.hrs);
          tmp.push(el.porcentaje + '%');
        } else if (el.padre == 2) {

          tmp.push({ text: '' + el.titulo, bold: true });
          tmp.push({ text: '' + el.hrs, bold: true });
          tmp.push({ text: '' + el.porcentaje, bold: true });
        }
        datos.push(tmp)
      })

    } else if (type == 'produccion') {
      filas.filter(el => el.padre != 1).forEach(el => {
        let tmp = [];
        if (el.padre == 0) {
          tmp.push('' + el.titulo);
          tmp.push('' + el.hrs);
        } else if (el.padre == 2) {
          tmp.push({ text: '' + el.titulo, bold: true });
          tmp.push({ text: '' + el.hrs, bold: true });
        }
        datos.push(tmp)
      })

    } else if (type == 'perdidas') {

      filas.forEach(el => {
        let tmp = [];
        if (el.padre == 0) {
          tmp.push('' + el.fuente);
          tmp.push('' + el.hrs);
          tmp.push(el.porcentaje + '%');
        } else if (el.padre == 1) {
          tmp.push({ text: '' + el.fuente, bold: true, colSpan: 3, style: 'subheader' });
          tmp.push({});
          tmp.push({});
        } else if (el.padre == 2) {

          tmp.push({ text: '' + el.fuente, bold: true });
          tmp.push({ text: '' + el.hrs, bold: true });
          tmp.push({ text: '' + el.porcentaje, bold: true });
        }
        datos.push(tmp)
      })
    }

    return datos;
  }

}
