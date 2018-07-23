import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { Catalogo } from '../../models/Catalogo';
import { AuthService } from '../../auth/auth.service';
import { Periodo } from '../../models/periodo';
import { RptPosicionAnualService } from './rpt-posicion-anual.service';
import { configChart } from './rpt.config.export';
import { clone } from '../../utils';

declare var $: any;
declare var Materialize: any;
@Component({
  selector: 'app-rpt-posicion-anual',
  templateUrl: './rpt-posicion-anual.component.html',
  providers: [RptPosicionAnualService]
})
export class RptPosicionAnualComponent implements OnInit {

  public loading: boolean;
  public submitted: boolean;
  public viewReport: boolean;
  public formConsultaPeriodo: FormGroup;
  public paramsBusqueda: any;
  public tituloGrafica: string;
  public anios: Array<any>;
  public meses: Array<any>;
  public periodos: Array<Periodo>;
  public graficas: Array<any>;
  public graficos_ok: boolean;


  constructor(
    private service: RptPosicionAnualService,
    private auth: AuthService,
    private fb: FormBuilder) { }

  ngOnInit() {

    this.loading = true;
    this.submitted = false;
    this.viewReport = false;
    this.tituloGrafica = "";
    this.paramsBusqueda = {};
    this.graficos_ok = false;


    this.anios = [];
    this.meses = [];
    this.periodos = [];
    this.graficas = [];




    this.service.getCatalogos(this.auth.getIdUsuario()).subscribe(result => {

      if (result.response.sucessfull) {

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
      anio: new FormControl({ value: this.paramsBusqueda.anio }, [Validators.required])
    });

  }

  /*
   * Carga plugins despues de cargar y mostrar objetos en el DOM cuando carga la pagina
   */
  ngAfterViewHttp(): void {
    $('.tooltipped').tooltip({ delay: 50 });
    $('select').material_select();
  }


  agregar() {
    $('.tooltipped').tooltip('hide');
  }

  regresar() {
    $('.tooltipped').tooltip('hide');
  }

  changeCombo(params: string): void {
    this.viewReport = false;
    this.graficos_ok = false;
    if (params == 'anio') {
      this.meses = this.periodos.filter(el => el.anio == this.paramsBusqueda.anio)
    }
  }

  busqueda(parametrosBusqueda: any) {

    this.viewReport = false;
    this.submitted = true;
    this.graficos_ok = false;
    this.graficas = [];

    if (this.formConsultaPeriodo.valid) {

      this.service.getGraficasPosicionAnual(this.auth.getIdUsuario(), parametrosBusqueda).subscribe(result => {

        if (result.response.sucessfull) {
          let result_grafica = result.data.posicionamientoAnual || [];



          let config_grafica = clone(configChart);

          /*
           * Proceso para asignar el color de la barra
           */
          let lugar = 0;
          result_grafica.forEach((element, index, arg) => {
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

          result_grafica.map(el => {
            data.push({ y: el.valor, color: el.color });
          });

          let etiquetas = result_grafica.map(el => el.name);
          let colores = result_grafica.map(el => el.color);


          config_grafica.series = [];
          config_grafica.xAxis.categories = etiquetas;
          config_grafica.colors = colores;
          config_grafica.series.push({ name: ' Calificación ', data: data });

          config_grafica.title.text = 'Posición anual ' + parametrosBusqueda.anio;
          this.graficas.push(config_grafica);

          this.viewReport = true;

          setTimeout(() => {
            this.rptAfterViewGenerate();
          }, 900);


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

  rptAfterViewGenerate(): void {
    this.graficas.forEach((grafica, index) => {
      $('#grafica' + index).highcharts(grafica);
    });
    this.graficos_ok = true;
  }


  getTextoLinea(lineas: Array<Catalogo>, id_etad: number): string {
    let el = lineas.filter(el => el.id == id_etad);

    if (el.length > 0) {
      return el[0].valor;
    } else {
      return "Linea no identificada"
    }
  }




  getPeriodo(periodos: Array<Periodo>, id_periodo: number): string {
    let el = periodos.filter(el => el.id_periodo == id_periodo);

    if (el.length > 0) {
      return "  " + el[0].descripcion_mes + " " + el[0].anio;
    } else {
      return "Linea no identificada"
    }
  }

}
