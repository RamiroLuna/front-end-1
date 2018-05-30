import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { RptOeeService } from "./rpt-oee.service";
import { Linea } from '../../models/linea';
import { AuthService } from '../../auth/auth.service';
import { Periodo } from '../../models/periodo';
import { getTablaUtf8 } from '../../utils';
import { Highcharts } from 'highcharts';
import { configChart } from './rpt.config.export';

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
  public formConsultaPeriodo: FormGroup;
  public paramsBusqueda: any;
  public lineas: Array<Linea>;
  public tituloGrafica: string;

  public texto_link: string;
  public seccion: number;
  public ver_tabla: boolean;
  public rows: Array<any>;

  public anios: Array<any>;
  public meses: Array<any>;
  public periodos: Array<Periodo>;

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
      this.meses = this.periodos.filter(el => el.anio == this.paramsBusqueda.anio)
    }
  }

  busqueda(parametrosBusqueda: any) {
    this.viewReport = false;
    this.submitted = true;

    if (this.formConsultaPeriodo.valid) {

      this.service.getOEE(this.auth.getIdUsuario(), parametrosBusqueda).subscribe(result => {

        if (result.response.sucessfull) {
          this.tituloGrafica = "OEE de  " + this.getTextoLinea(this.lineas, parametrosBusqueda.idLinea);

          this.rows = result.data.reporteOEE || [];
          let meta_esperada = this.rows.filter((el) => el.padre == 0).map((el) => el.meta);
          let labels = this.rows.filter((el) => el.padre == 0).map((el) => el.titulo);
          let horas = this.rows.filter((el) => el.padre == 0).map((el) => el.porcentaje);

          horas = horas.map(el => el = parseFloat(el).toFixed(3));
          horas = horas.map(el => el = parseFloat(el));


          meta_esperada = meta_esperada.map(el => el = parseFloat(el).toFixed(3));
          meta_esperada = meta_esperada.map(el => el = parseFloat(el));


          configChart.series = [];
          configChart.title.text = this.tituloGrafica;
          configChart.subtitle.text = 'Periodo: ' + this.getPeriodo(this.periodos, parametrosBusqueda.idPeriodo);
          configChart.xAxis.categories = labels;
          configChart.series.push({ name: ' Real ', data: horas });
          configChart.series.push({ name: ' Meta esperada ', data: meta_esperada, type: 'line' });

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

  exportarExcel(): void {
    let linkFile = document.createElement('a');
    let data_type = 'data:application/vnd.ms-excel;';

    let tabla = getTablaUtf8('tblReporte');
    linkFile.href = data_type + ', ' + tabla;
    linkFile.download = 'ReporteDeOEE';

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
