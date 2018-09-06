import { Component, OnInit } from '@angular/core';
import { configChart } from '../../oee/rpt-fuente-perdidas/rpt.config.export';
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
  public time_await:number = 4000; // tiempo en milisegundos

  constructor() { }

  ngOnInit() {
    this.loading = true;
    this.isOk = false;

    this.OEE = localStorage.getItem('OEE');

    if (this.OEE == null || this.OEE === undefined) {
      this.loading = false;
    } else {
      this.height = $(window).height();
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

        // Perdidas AMUT1
        case 2:
          this.time_await = 20000;
          let rows = this.OEE[0]
          let labels = rows.filter((el) => el.padre == 0).map((el) => el.fuente);
          let horas = rows.filter((el) => el.padre == 0).map((el) => el.hrs);
          let titulo = rows.filter(el => el.padre == 1)[0].titulo_grafica;
          configChart.series = [];
          configChart.title.text = titulo;
          configChart.xAxis.categories = labels;
          configChart.series.push({ name: 'Horas Muertas', data: horas });
          $('#grafica').highcharts(configChart);
          break;
      }

      //Ejecuta evento de animación
      setTimeout(() => {

        this.status = 'active';
        this.type_animation = 'enfasis';
      }, 200);
    }, 200);

  }


}
