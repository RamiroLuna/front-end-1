import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { RptOeeFallasService } from "./rpt-oee-fallas.service";
import { Linea } from '../../models/linea';
import * as Chart from 'chart.js';
import { AuthService } from '../../auth/auth.service';

declare var $: any;
declare var Materialize: any;
@Component({
  selector: 'app-rpt-oee-fallas',
  templateUrl: './rpt-oee-fallas.component.html',
  styleUrls: ['./rpt-oee-fallas.component.css'],
  providers: [RptOeeFallasService]
})
export class RptOeeFallasComponent implements OnInit {

  public loading: boolean;
  public submitted: boolean;
  public viewReport: boolean;
  public formBusqueda: FormGroup;
  public paramsBusqueda: any;
  public lineas: Array<Linea>;

  public texto_link: string = "Ver datos en tabla";
  public seccion: number = 0;
  public ver_tabla: boolean = false;
  public rows: Array<any> = [];

  public options: any = {
    scales: {
      xAxes: [{

        ticks: {
          autoSkip: false
        }, scaleLabel: {
          display: true,
          labelString: 'Horas muertas',
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
      text: 'Fallas',
      fontColor: '#303f9f',
      fontStyle: 'bold',
      fontSize: 26
    },
    responsive: true
  };


  public data: any = {
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
    private service: RptOeeFallasService,
    private auth: AuthService,
    private fb: FormBuilder) { }

  ngOnInit() {

    this.loading = true;
    this.submitted = false;
    this.viewReport = false;
    this.paramsBusqueda = {};

    this.service.getCatalogos(this.auth.getIdUsuario()).subscribe(result => {

      if (result.response.sucessfull) {
        this.lineas = result.data.listLineas || [];
        this.lineas = this.lineas.filter(el=>el.id_linea != 6).map(el=>el);
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

    let ctx = $('#chartFails').get(0).getContext('2d');
    let disp = new Chart(ctx, {
      type: 'horizontalBar',
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

      this.service.getOEEFallasByLinea(this.auth.getIdUsuario(), parametrosBusqueda).subscribe(result => {
     
        if (result.response.sucessfull) {
          this.rows = result.data.listaOEEFallas || [];
          let labels = this.rows.filter((el) => el.padre == 0).map((el) => el.fuente);
          let horas = this.rows.filter((el) => el.padre == 0).map((el) => el.hrs);
    
          this.data.labels = labels;
          this.data.datasets[0].label = 'Horas Muertas';
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



}
