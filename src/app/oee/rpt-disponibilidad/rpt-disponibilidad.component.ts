import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { RptDisponibilidadService } from "./rpt-disponibilidad.service";
import { Linea } from '../../models/linea';
import { AuthService } from '../../auth/auth.service';
import { Periodo } from '../../models/periodo';
import { getTablaUtf8 } from '../../utils';
import { Highcharts } from 'highcharts';
import { configChart } from './rpt.config.export';

declare var $: any;
declare var Materialize: any;
@Component({
  selector: 'app-rpt-disponibilidad',
  templateUrl: './rpt-disponibilidad.component.html',
  providers: [RptDisponibilidadService]
})
export class RptDisponibilidadComponent implements OnInit {

  public loading: boolean;
  public submitted: boolean;
  public viewReport: boolean;
  public formConsultaPeriodo: FormGroup;
  public parametrosBusqueda: any;
  public lineas: Array<Linea>;
  public tituloGrafica: string;

  public texto_link: string;
  public seccion: number;
  public ver_tabla: boolean;
  public rows: Array<any>;
  public rowsProduccion: Array<any>;

  public anios: Array<any>;
  public meses: Array<any>;
  public periodos: Array<Periodo>;

 
  constructor(
    private service: RptDisponibilidadService,
    private auth: AuthService,
    private fb: FormBuilder) { }

  ngOnInit() {

    this.loading = true;
    this.submitted = false;
    this.viewReport = false;
    this.ver_tabla = false;
    this.rows = [];
    this.rowsProduccion = [];
    this.seccion = 0;
    this.tituloGrafica = "";
    this.texto_link = "Ver datos en tabla";
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
        this.texto_link = "Ver datos en tabla(s)";
        this.ver_tabla = false;
        this.seccion = $(ele).index();
        $('.carousel li').css('background-color', '#bdbdbd');
        $('.carousel .indicators .indicator-item.active').css('background-color', '#757575');

        switch (this.seccion) {
          case 1:
            break;
        }
      }
    });

    $('.carousel li').css('background-color', '#bdbdbd');
    $('.carousel .indicators .indicator-item.active').css('background-color', '#757575');



    $('#divGrafica').highcharts(configChart);

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
      this.meses = this.periodos.filter(el => el.anio == this.parametrosBusqueda.anio)
    }
  }

  busqueda(parametrosBusqueda: any) {

    this.viewReport = false;
    this.submitted = true;

    if (this.formConsultaPeriodo.valid) {

      this.service.reporteDisponibilidad(this.auth.getIdUsuario(), parametrosBusqueda).subscribe(result => {
        console.log('rept disponobilidad' , result)
        if (result.response.sucessfull) {
          this.tituloGrafica = "Disponibilidad de " + this.getTextoLinea(this.lineas, parametrosBusqueda.idLinea);
         
          this.rows = result.data.reporteDisponibilidad || [];
          this.rowsProduccion = result.data.datosProduccion || [];
          let labels = this.rows.filter((el) => el.padre == 0).map((el) => el.titulo);
          let horas = this.rows.filter((el) => el.padre == 0).map((el) => el.hrs);

          configChart.series = [];
          configChart.title.text = this.tituloGrafica;
          configChart.subtitle.text = 'Periodo: ' + this.getPeriodo(this.periodos, parametrosBusqueda.idPeriodo);
          configChart.xAxis.categories = labels ;
          configChart.series.push({ name: ' Horas ' , data :  horas });


       
          

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

  exportarExcel(): void {
    let linkFile = document.createElement('a');
    let data_type = 'data:application/vnd.ms-excel;';

    let tablas = getTablaUtf8('tblReporte') + getTablaUtf8('tblReporteProduccion');

    linkFile.href = data_type + ', ' + tablas;
    linkFile.download = 'ReporteDisponibilidad';

    linkFile.click();
    linkFile.remove();

  }


}
