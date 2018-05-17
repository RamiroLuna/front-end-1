import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { RptDesempenioDiarioService } from "./rpt-desempenio-diario.service";
import { Linea } from '../../models/linea';
import * as Chart from 'chart.js';
import { AuthService } from '../../auth/auth.service';
import { Periodo } from '../../models/periodo';

declare var $: any;
declare var Materialize: any;

@Component({
  selector: 'app-rpt-desempenio-diario',
  templateUrl: './rpt-desempenio-diario.component.html',
  providers: [RptDesempenioDiarioService]
})
export class RptDesempenioDiarioComponent implements OnInit {

  public loading: boolean;
  public submitted: boolean;
  public viewReport: boolean;
  public formConsultaPeriodo: FormGroup;
  public parametrosBusqueda: any;
  public lineas: Array<Linea>;
  public tituloGrafica: string;
  public seccion: number;
  public rows: Array<any>;
  public anios: Array<any>;
  public meses: Array<any>;
  public periodos: Array<Periodo>;

  public options: any = {
    scales: {
      yAxes: [{
        stacked: false,
        ticks: {
          beginAtZero: false
        },
        scaleLabel: {
          display: true,
          labelString: 'Toneladas'
        }
      }],
      xAxes: [{
        stacked: true,
        ticks: {
          beginAtZero: true
        }
      }]

    }, legend: {
      display: true,
      position: 'bottom'
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


  public data: any = {
    labels: [],
    datasets: []
  };

  constructor(
    private service: RptDesempenioDiarioService,
    private auth: AuthService,
    private fb: FormBuilder) { }

  ngOnInit() {

    this.loading = true;
    this.submitted = false;
    this.viewReport = false;
    this.rows = [];
    this.seccion = 0;
    this.tituloGrafica = "";
    this.parametrosBusqueda = {
    };
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
      idLinea: new FormControl({ value: this.parametrosBusqueda.idLinea }, [Validators.required]),
      anio: new FormControl({ value: this.parametrosBusqueda.anio }, [Validators.required]),
      idPeriodo: new FormControl({ value: this.parametrosBusqueda.idPeriodo }, [Validators.required])
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
        this.seccion = $(ele).index();
        $('.carousel li').css('background-color', '#bdbdbd');
        $('.carousel .indicators .indicator-item.active').css('background-color', '#757575');

        switch (this.seccion) {
          case 1:
            disp.update();
            break;
        }
      }
    });

    $('.carousel li').css('background-color', '#bdbdbd');
    $('.carousel .indicators .indicator-item.active').css('background-color', '#757575');

    let ctx = $('#chart').get(0).getContext('2d');
    let disp = new Chart(ctx, {
      type: 'bar',
      data: this.data,
      options: this.options
    });

  }

  regresar() {
    $('.tooltipped').tooltip('hide');
  }

  changeCombo(params: string): void {
    this.viewReport = false;
    if (params == 'anio') {
      this.meses = this.periodos.filter(el => el.anio == this.parametrosBusqueda.anio)
    }
  }

  busqueda(parametrosBusqueda: any) {

    this.viewReport = false;
    this.submitted = true;
    this.data.datasets = [];

    if (this.formConsultaPeriodo.valid) {

      this.service.reporteDailyPerformance(this.auth.getIdUsuario(), parametrosBusqueda).subscribe(result => {

        if (result.response.sucessfull) {
          this.tituloGrafica = "Desempeño diario de " + this.getTextoLinea(this.lineas, parametrosBusqueda.idLinea) + this.getPeriodo(this.periodos, parametrosBusqueda.idPeriodo);
          this.options.title.text = this.tituloGrafica;
          this.rows = result.data.reporteDailyPerformance || [];

          let labels = this.rows.filter((el) => el.padre == 0).map(element => element.dia);

          let dataGrupoA = this.rows.filter((el) => el.padre == 0).map((el) => el.a);
          let dataGrupoB = this.rows.filter((el) => el.padre == 0).map((el) => el.b);
          let dataGrupoC = this.rows.filter((el) => el.padre == 0).map((el) => el.c);
          let dataGrupoD = this.rows.filter((el) => el.padre == 0).map((el) => el.d);
          let dataMeta1 = this.rows.filter((el) => el.padre == 0).map((el) => el.meta1); 
          let dataMeta2 = this.rows.filter((el) => el.padre == 0).map((el) => el.meta2); 
          let dataMeta3 = this.rows.filter((el) => el.padre == 0).map((el) => el.meta3); 

          this.data.labels = labels;
          this.data.datasets = [];

          this.data.datasets.push({
            label: 'A',
            data: dataGrupoA,
            backgroundColor: 'rgb(239,154,154,0.5)',
            borderColor: 'rgb(183,28,28)',
            borderWidth: 1
          });

          this.data.datasets.push({
            label: 'B',
            data: dataGrupoB,
            backgroundColor: 'rgb(165,214,167,0.5)',
            borderColor: 'rgb(46,125,50)',
            borderWidth: 1
          });

          this.data.datasets.push({
            label: 'C',
            data: dataGrupoC,
            backgroundColor: 'rgb(230,238,156,0.5)',
            borderColor: 'rgb(158,157,36)',
            borderWidth: 1
          });

          this.data.datasets.push({
            label: 'D',
            data: dataGrupoD,
            backgroundColor: 'rgb(197,202,233,0.5)',
            borderColor: 'rgb(26,35,126)',
            borderWidth: 1
          });

          this.data.datasets.push({
            type: 'line',
            label: 'Meta 1ro',
            data: dataMeta1,
            fill: false,
            borderColor: 'orange',
            backgroundColor: 'transparent',
            pointBorderColor: 'orange',
            pointBackgroundColor: 'rgba(255,150,0,0.8)'
          });

          this.data.datasets.push({
            type: 'line',
            label: 'Meta 2do',
            data: dataMeta2,
            fill: false,
            borderColor: 'blue',
            backgroundColor: 'transparent',
            pointBorderColor: 'blue',
            pointBackgroundColor: 'rgb(26,35,126,0.8)'
          });

          this.data.datasets.push({
            type: 'line',
            label: 'Meta dia',
            data: dataMeta3,
            fill: false,
            borderColor: 'green',
            backgroundColor: 'transparent',
            pointBorderColor: 'green',
            pointBackgroundColor: 'rgb(27,94,32,0.8)'
          });

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
  }

  getTextoLinea(lineas: Array<Linea>, id_linea: number): string {
    let el = lineas.filter(el => el.id_linea == id_linea);

    if (el.length > 0) {
      return el[0].descripcion;
    } else {
      return "Linea no identificada"
    }
  }

  getPeriodo(periodos: Array<Periodo>, id_periodo: number): string {
    let el = periodos.filter(el => el.id_periodo == id_periodo);

    if (el.length > 0) {
      return "  " + el[0].descripcion_mes + "  " + el[0].anio;
    } else {
      return "Linea no identificada"
    }
  }

  downloadCharts(event): void {
    event.preventDefault();
    let img = document.createElement('a');

    let canvas = $('#chart');
    let data = canvas[0].toDataURL("image/png");

    img.setAttribute("id", "tmpImagen");
    img.href = data;
    img.download = "Grafica_desempenio_diario";

    img.click();
    img.remove();

  }


}
