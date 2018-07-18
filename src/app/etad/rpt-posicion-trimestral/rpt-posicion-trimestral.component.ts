import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { Catalogo } from '../../models/Catalogo';
import { AuthService } from '../../auth/auth.service';
import { Periodo } from '../../models/periodo';
import { RptPosicionTrimestralService } from './rpt-posicion-trimestral.service';
import { configChart } from './rpt.config.export';
import { clone } from '../../utils';

declare var $: any;
declare var Materialize: any;
@Component({
  selector: 'app-rpt-posicion-trimestral',
  templateUrl: './rpt-posicion-trimestral.component.html',
  providers: [RptPosicionTrimestralService]
})
export class RptPosicionTrimestralComponent implements OnInit {

  public loading: boolean;
  public submitted: boolean;
  public viewReport: boolean;
  public formConsultaPeriodo: FormGroup;
  public paramsBusqueda: any;
  public tituloGrafica: string;
  public anios: Array<any>;
  public meses: Array<any>;
  public periodos: Array<Periodo>;
  public trimetres: Array<any>;
  public graficas: Array<any>;
  public mesesTrimestre: Array<any>;


  constructor(
    private service: RptPosicionTrimestralService,
    private auth: AuthService,
    private fb: FormBuilder) { }

  ngOnInit() {

    this.loading = true;
    this.submitted = false;
    this.viewReport = false;
    this.tituloGrafica = "";
    this.paramsBusqueda = {};

    this.anios = [];
    this.meses = [];
    this.periodos = [];
    this.graficas = [];
    this.trimetres = [
      { id: 1, value: "PRIMER TRIMESTRE" },
      { id: 2, value: "SEGUNDO TRIMESTRE" },
      { id: 3, value: "TERCER TRIMESTRE" },
      { id: 4, value: "CUARTO TRIMESTRE" }
    ];

    this.mesesTrimestre = [
      { value: 'ENERO', id_trimestre: 1 },
      { value: 'FEBRERO', id_trimestre: 1 },
      { value: 'MARZO', id_trimestre: 1 },
      { value: 'ABRIL', id_trimestre: 2 },
      { value: 'MAYO', id_trimestre: 2 },
      { value: 'JUNIO', id_trimestre: 2 },
      { value: 'JULIO', id_trimestre: 3 },
      { value: 'AGOSTO', id_trimestre: 3 },
      { value: 'SEPTIEMBRE', id_trimestre: 3 },
      { value: 'OCTUBRE', id_trimestre: 4 },
      { value: 'NOVIEMBRE', id_trimestre: 4 },
      { value: 'DICIEMBRE', id_trimestre: 4 }
    ];

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
      idTrimestre: new FormControl({ value: this.paramsBusqueda.idTrimestre }, [Validators.required]),
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
    if (params == 'anio') {
      this.meses = this.periodos.filter(el => el.anio == this.paramsBusqueda.anio)
    }
  }

  busqueda(parametrosBusqueda: any) {

    this.viewReport = false;
    this.submitted = true;
    this.graficas = [];

    if (this.formConsultaPeriodo.valid) {

      this.service.getGraficasPosicionTrimestral(this.auth.getIdUsuario(), parametrosBusqueda).subscribe(result => {

        if (result.response.sucessfull) {
          let total_graficas = result.data.posicionamiento || [];

          let meses_del_trimestre = this.mesesTrimestre.filter(el => el.id_trimestre == parametrosBusqueda.idTrimestre)
                                    .map(el=>el.value);
          total_graficas.map((el, index) => {
            let config_grafica = clone(configChart);

            /*
             * Proceso para asignar el color de la barra
             */
            let lugar = 0;
            el.forEach((element, index, arg) => {
              if (index > 0) {

                if (element.valor < arg[index - 1].valor) {
                  lugar++;
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

            el.map(el => {
              data.push({ y: el.valor, color: el.color });
            });

            let etiquetas = el.map(el => el.name);
            let colores = el.map(el => el.color);


            config_grafica.series = [];
            config_grafica.xAxis.categories = etiquetas;
            config_grafica.colors = colores;
            config_grafica.series.push({ name: ' Calificación ', data: data });

            config_grafica.title.text = 'Posición trimestral';

            switch (index) {
              case 0:
                config_grafica.subtitle.text = meses_del_trimestre[0];
                break;
              case 1:
                config_grafica.subtitle.text = meses_del_trimestre[0] + ' Y ' + meses_del_trimestre[1];
                break;
              case 2:
                config_grafica.subtitle.text = meses_del_trimestre[0] + ', ' + meses_del_trimestre[1] + ' Y ' + meses_del_trimestre[2];
                break;
            }


            this.graficas.push(config_grafica);
          });

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
