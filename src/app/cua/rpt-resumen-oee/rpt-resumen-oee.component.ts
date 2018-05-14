import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { RptResumenOeeService } from "./rpt-resumen-oee.service";
import { Linea } from '../../models/linea';
import * as Chart from 'chart.js';
import { AuthService } from '../../auth/auth.service';
import { Periodo } from '../../models/periodo';

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
      duration: 3000,
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
            let cjs =  $('#chart').get(0).getContext('2d');
           // cjs.update();
            break;
          case 1:
            let t = $('#chartDisponibilidad').get(0).getContext('2d');
            // t.update();
            break;
          case 2:
            let c = $('#chartPerdidas').get(0).getContext('2d');
            // c.update();
            break;
        }
      }
    });

    $('.carousel li').css('background-color', '#bdbdbd');
    $('.carousel .indicators .indicator-item.active').css('background-color', '#757575');

    let ctx = $('#chart').get(0).getContext('2d');
    let ctxDispo = $('#chartDisponibilidad').get(0).getContext('2d');

    let disp = new Chart(ctx, {
      type: 'bar',
      data: this.data,
      options: this.options
    }
    );

    let chartdis = new Chart(ctxDispo, {
      type: 'horizontalBar',
      data: this.dataDisponibilidad,
      options: this.optionsDisponibilidad
    });

  }

  /*
   * Carga plugins para mostrar grafica 
   */
  ngAfterViewHttpRptPerdida(): void {
    let ctx = $('#chartPerdidas').get(0).getContext('2d');
    let disp = new Chart(ctx, {
      type: 'horizontalBar',
      data: this.dataPerdidas,
      options: this.optionsPerdidas
    }
    );
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
          this.rows = result.data.reporteDisponibilidad || [];
          this.rowsProduccion = result.data.datosProduccion || [];
          let labelsDisponibilidad = this.rows.filter((el) => el.padre == 0).map((el) => el.titulo);
          let horasDisponibilidad = this.rows.filter((el) => el.padre == 0).map((el) => el.hrs);

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
      let tabla_div = document.getElementById('tblReporte');
      let tabla_html = tabla_div.outerHTML.replace(/ /g, '%20')
        .replace(/á/g, '%e1')
        .replace(/Á/g, '%c1')
        .replace(/é/g, '%e9')
        .replace(/É/g, '%c9')
        .replace(/í/g, '%a1')
        .replace(/Í/g, '%ed')
        .replace(/ó/g, '%f3')
        .replace(/Ó/g, '%d3')
        .replace(/ú/g, '%fa')
        .replace(/Ú/g, '%da')
        .replace(/Ñ/g, '%d1')
        .replace(/ñ/g, '%f1')

      linkFile.href = data_type + ', ' + tabla_html;
      linkFile.download = 'ReporteOEE';
    } else if (this.seccion == 1) {
      let tabla_div = document.getElementById('tblReporte');
      let tabla_html = tabla_div.outerHTML.replace(/ /g, '%20')
        .replace(/á/g, '%e1')
        .replace(/Á/g, '%c1')
        .replace(/é/g, '%e9')
        .replace(/É/g, '%c9')
        .replace(/í/g, '%a1')
        .replace(/Í/g, '%ed')
        .replace(/ó/g, '%f3')
        .replace(/Ó/g, '%d3')
        .replace(/ú/g, '%fa')
        .replace(/Ú/g, '%da')
        .replace(/Ñ/g, '%d1')
        .replace(/ñ/g, '%f1')

      let tablaProduccion = document.getElementById('tblReporteProduccion');
      let tablaHtmlProduccion = tablaProduccion.outerHTML.replace(/ /g, '%20')
        .replace(/á/g, '%e1')
        .replace(/Á/g, '%c1')
        .replace(/é/g, '%e9')
        .replace(/É/g, '%c9')
        .replace(/í/g, '%a1')
        .replace(/Í/g, '%ed')
        .replace(/ó/g, '%f3')
        .replace(/Ó/g, '%d3')
        .replace(/ú/g, '%fa')
        .replace(/Ú/g, '%da')
        .replace(/Ñ/g, '%d1')
        .replace(/ñ/g, '%f1')

      linkFile.href = data_type + ', ' + tabla_html + tablaHtmlProduccion;
      linkFile.download = 'ReporteDisponibilidad';
    } else if (this.seccion == 2) {
      let tabla_div = document.getElementById('tblReporte');
      let tabla_html = tabla_div.outerHTML.replace(/ /g, '%20')
        .replace(/á/g, '%e1')
        .replace(/Á/g, '%c1')
        .replace(/é/g, '%e9')
        .replace(/É/g, '%c9')
        .replace(/í/g, '%a1')
        .replace(/Í/g, '%ed')
        .replace(/ó/g, '%f3')
        .replace(/Ó/g, '%d3')
        .replace(/ú/g, '%fa')
        .replace(/Ú/g, '%da')
        .replace(/Ñ/g, '%d1')
        .replace(/ñ/g, '%f1')

      linkFile.href = data_type + ', ' + tabla_html;
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


}
