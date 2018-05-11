import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { RptOeeService } from "./rpt-oee.service";
import { Linea } from '../../models/linea';
import * as Chart from 'chart.js';
import { AuthService } from '../../auth/auth.service';

declare var $: any;
declare var Materialize: any;
@Component({
  selector: 'app-rpt-oee',
  templateUrl: './rpt-oee.component.html',
  providers: [RptOeeService]
})
export class RptOeeComponent implements OnInit {

  public loading: boolean;
  public submitted: boolean;
  public viewReport: boolean;
  public formBusqueda: FormGroup;
  public paramsBusqueda: any;
  public lineas: Array<Linea>;
  public tituloGrafica: string;

  public texto_link: string;
  public seccion: number;
  public ver_tabla: boolean;
  public rows: Array<any>;

  public options: any = {
    scales: {
      xAxes: [{

        ticks: {
          autoSkip: false
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


  public data: any = {
    labels: [],
    datasets: [{
      label: '',
      data: [],
      backgroundColor: 'rgba(102,187,106)',
      borderColor: 'rgba(56,142,60)',
      borderWidth: 1
    }]
  };

  constructor(
    private service: RptOeeService,
    private auth: AuthService,
    private fb: FormBuilder) { }

  ngOnInit() {

    this.loading = true;
    this.submitted = false;
    this.viewReport = false;
    this.ver_tabla = false;
    this.rows = [];
    this.seccion = 0;
    this.tituloGrafica = "";
    this.texto_link = "Ver datos en tabla";
    this.paramsBusqueda = {};

    this.service.getCatalogos(this.auth.getIdUsuario()).subscribe(result => {

      if (result.response.sucessfull) {
        this.lineas = result.data.listLineas || [];
        this.lineas = this.lineas.filter(el => el.id_linea != 6).map(el => el);
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
    this.formBusqueda = this.fb.group({
      inicio: new FormControl({ value: this.paramsBusqueda.inicio, disabled: false }, [Validators.required]),
      fin: new FormControl({ value: this.paramsBusqueda.fin, disabled: false }, [Validators.required]),
      id_linea: new FormControl({ value: this.paramsBusqueda.id_linea, disabled: false }, [Validators.required])
    });

  }

  /*
   * Carga plugins despues de cargar y mostrar objetos en el DOM cuando carga la pagina
   */
  ngAfterViewHttp(): void {
    $('.tooltipped').tooltip({ delay: 50 });
    $('select').material_select();

    $('.inicio, .fin').pickadate({
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
      onClose: () => {
        this.paramsBusqueda.inicio = $('.inicio').val();
        this.paramsBusqueda.fin = $('.fin').val();
      }
    });
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

  changeCombo(): void {
    this.viewReport = false;
  }

  busqueda(parametrosBusqueda: any) {

    this.viewReport = false;
    this.submitted = true;

    if (this.formBusqueda.valid) {

      this.service.getOEE(this.auth.getIdUsuario(), parametrosBusqueda).subscribe(result => {

        if (result.response.sucessfull) {
          this.tituloGrafica = "OEE de  " + this.getTextoLinea(this.lineas, parametrosBusqueda.id_linea) +
            "  del  " + parametrosBusqueda.inicio + "  al  " + parametrosBusqueda.fin;
          this.options.title.text = this.tituloGrafica;
          this.rows = result.data.reporteOEE || [];
          let labels = this.rows.filter((el) => el.padre == 0).map((el) => el.titulo);
          let horas = this.rows.filter((el) => el.padre == 0).map((el) => el.porcentaje);

          this.data.labels = labels;
          this.data.datasets[0].label = 'OEE';
          this.data.datasets[0].data = horas;

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

  downloadCharts(event): void {
    event.preventDefault();
    let img = document.createElement('a');

    let canvas = $('#chart');
    let data = canvas[0].toDataURL("image/png");

    img.setAttribute("id", "tmpImagen");
    img.href = data;
    img.download = "Grafica_fallas";

    img.click();
    img.remove();

  }

  exportarExcel(): void {
    let linkFile = document.createElement('a');
    let data_type = 'data:application/vnd.ms-excel;';

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

    linkFile.click();
    linkFile.remove();

  }


}
