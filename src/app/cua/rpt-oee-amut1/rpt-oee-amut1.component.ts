import { Component, OnInit } from '@angular/core';
import * as Chart from 'chart.js';

declare var $: any;
@Component({
  selector: 'app-rpt-oee-amut1',
  templateUrl: './rpt-oee-amut1.component.html',
  styleUrls: ['./rpt-oee-amut1.component.css']
})
export class RptOeeAmut1Component implements OnInit {

  public texto_link: string = "Ver datos en tabla";
  public seccion: number = 0;
  public ver_tabla:boolean = false;

  public options: any = {
    scales: {
      xAxes: [{

        ticks: {
          autoSkip: false
        }
      }],
      yAxes: [{
        ticks: {
          beginAtZero: true
        },
        scaleLabel: {
          display: true,
          labelString: 'Horas',
        }
      }]
    },
    legend: {
      display: false,
    },
    title: {
      display: true,
      text: 'Disponibilidad Amut 1',
      fontColor: '#303f9f',
      fontStyle: 'bold',
      fontSize: 26
    }
  };

  public options2: any = {
    scales: {
      xAxes: [{

        ticks: {
          autoSkip: false
        }
      }],
      yAxes: [{
        ticks: {
          beginAtZero: true
        },
        scaleLabel: {
          display: true,
          labelString: '%',
        }
      }]
    },
    legend: {
      display: false,
    },
    title: {
      display: true,
      text: 'OEE Amut 1',
      fontColor: '#303f9f',
      fontStyle: 'bold',
      fontSize: 26
    }
  };

  public data2: any = {
    labels: ["Disponibiliad",
      "Utilizacion",
      "Calidad",
      "OEE",
      "TEEP",
      "TM"
    ],
    datasets: [{
      label: '# of Votes',
      data: [12, 19, 3, 5, 2, 3],
      backgroundColor: [
        'rgba(255, 99, 132, 0.2)',
        'rgba(54, 162, 235, 0.2)',
        'rgba(255, 206, 86, 0.2)',
        'rgba(75, 192, 192, 0.2)',
        'rgba(153, 102, 255, 0.2)',
        'rgba(255, 159, 64, 0.2)'
      ],
      borderColor: [
        'rgba(255,99,132,1)',
        'rgba(54, 162, 235, 1)',
        'rgba(255, 206, 86, 1)',
        'rgba(75, 192, 192, 1)',
        'rgba(153, 102, 255, 1)',
        'rgba(255, 159, 64, 1)'
      ],
      borderWidth: 1
    }]
  };
  public data: any = {
    labels: ["Tiempo Disponible Total",
      "No Ventas",
      "Tiempo Disponible",
      "Paros planeados",
      "Paros no planeados",
      "Reduccion de velocidad",
      "Por calidad",
      "Desempeño efectivo total de equipos",
      "Total de hora de paro"
    ],
    datasets: [{
      label: '# of Votes',
      data: [12, 19, 3, 5, 2, 3, 2, 3, 4],
      backgroundColor: [
        'rgba(255, 99, 132, 0.2)',
        'rgba(54, 162, 235, 0.2)',
        'rgba(255, 206, 86, 0.2)',
        'rgba(75, 192, 192, 0.2)',
        'rgba(153, 102, 255, 0.2)',
        'rgba(255, 159, 64, 0.2)'
      ],
      borderColor: [
        'rgba(255,99,132,1)',
        'rgba(54, 162, 235, 1)',
        'rgba(255, 206, 86, 1)',
        'rgba(75, 192, 192, 1)',
        'rgba(153, 102, 255, 1)',
        'rgba(255, 159, 64, 1)'
      ],
      borderWidth: 1
    }]
  };

  public tiempos: Array<any> = [
    { tiempo: 'Tiempo Disponible Total', porcentaje: 744, hrs: 10, type: 'subtotal' },
    { tiempo: 'No Ventas', porcentaje: 1, hrs: 0.0, type: 'subtotal' },
    { tiempo: 'Tiempo Disponible', porcentaje: 1, hrs: 744, type: 'subtotal' },
    { tiempo: 'Paros planeados', porcentaje: 1, hrs: 72.4, type: 'subtotal' },
    { tiempo: 'Paros no planeados', porcentaje: 1, hrs: 39.6, type: 'subtotal' },
    { tiempo: 'Reduccion de velocidad', porcentaje: 1, hrs: 7.2, type: 'subtotal' },
    { tiempo: 'Por calidad', porcentaje: 1, hrs: 2.2, type: 'subtotal' },
    { tiempo: 'Desempeño efectivo total de equipos', porcentaje: 1, hrs: 622.6, type: 'total' },
    { tiempo: 'Total de hora de paro', porcentaje: 1, hrs: 112.0, type: 'total' },
  ]

  public producciones: Array<any> = [
    { produccion: 'Velocidad Ideal (hora)', hrs: 3.5 },
    { produccion: 'Capacidad productiva', hrs: 28.0 },
    { produccion: 'Tiempo Disponible', hrs: 744 },
    { produccion: 'Tiempo operacion', hrs: 632.0 },
    { produccion: 'Produccion buena', hrs: 2238.2 },
    { produccion: 'Produccion total', hrs: 2284.0 }
  ]

  public item_oee: Array<any> = [
    { descripcion: 'Disponibilidad', oee: 632.0, real: '84.9%'},
    { descripcion: 'Utilizacion', oee: 3.541, real: '101.2%'},
    { descripcion: 'Calidad', oee: 0, real: '98.0%'},
    { descripcion: 'OEE', oee: 0, real: '84.2%'},
    { descripcion: 'TEM', oee: 622.6, real: '83.7%'},
    { descripcion: 'TM', oee: 121.4, real: '16.3%'},
  ]

  constructor() { }

  ngOnInit() {
    $('.carousel.carousel-slider').carousel({
      fullWidth: true,
      indicators: true,
      onCycleTo:  (ele, dragged) =>{
        this.texto_link = "Ver datos en tabla(s)";
        this.ver_tabla = false;
        this.seccion = $(ele).index();
        $('.carousel li').css('background-color', '#bdbdbd');
        $('.carousel .indicators .indicator-item.active').css('background-color', '#757575');
      }
    });

    $('.carousel li').css('background-color', '#bdbdbd');
    $('.carousel .indicators .indicator-item.active').css('background-color', '#757575');

    var ctx = $('#myChart').get(0).getContext('2d');
    new Chart(ctx, {
      type: 'bar',
      data: this.data,
      options: this.options
    });

    var ctx = $('#oee').get(0).getContext('2d');
    new Chart(ctx, {
      type: 'bar',
      data: this.data2,
      options: this.options2
    });

    $('.tooltipped').tooltip({ delay: 50 });

  }


  verTablas(event): void {
    event.preventDefault();
    this.ver_tabla = !this.ver_tabla;
    this.texto_link = this.ver_tabla? "Ocultar tabla(s)": "Ver datos en tabla(s)";
  }


  agregar() {
    $('.tooltipped').tooltip('hide');
  }

  regresar() {
    $('.tooltipped').tooltip('hide');
  }



}