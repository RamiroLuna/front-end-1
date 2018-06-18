import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { Linea } from '../../models/linea';
import { AuthService } from '../../auth/auth.service';
import { Periodo } from '../../models/periodo';
import { getTablaUtf8 } from '../../utils';
import { RptVelocidadPromedioService } from './rpt-velocidad-promedio.service';
import { configChartSpider } from './rpt.config.export';

declare var $: any;
declare var Materialize: any;
@Component({
  selector: 'app-rpt-velocidad-promedio',
  templateUrl: './rpt-velocidad-promedio.component.html',
  styleUrls: ['./rpt-velocidad-promedio.component.css'],
  providers: [RptVelocidadPromedioService]
})
export class RptVelocidadPromedioComponent implements OnInit {

  public loading: boolean;
  public submitted: boolean;
  public viewReport: boolean;
  public formConsultaPeriodo: FormGroup;
  public paramsBusqueda: any;
  public lineas: Array<Linea>;
  public tituloGrafica: string;
  public rows: Array<any>;
  public rowsGrafica: Array<any>;
  public anios: Array<any>;
  public meses: Array<any>;
  public periodos: Array<Periodo>;
  public ver_tabla: boolean;
  public texto_link: string;

  constructor(
    private service: RptVelocidadPromedioService,
    private auth: AuthService,
    private fb: FormBuilder) { }

  ngOnInit() {

    this.loading = true;
    this.submitted = false;
    this.viewReport = false;
    this.ver_tabla = false;
    this.rows = [];

    this.rowsGrafica = [];
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
    this.rows = [];
    this.rowsGrafica = [];

    if (this.formConsultaPeriodo.valid) {

      this.service.reporteVelocidadPromedio(this.auth.getIdUsuario(), parametrosBusqueda).subscribe(result => {

        if (result.response.sucessfull) {
          let titulo = 'Velocidad promedio por grupo ' + this.getLinea(this.lineas, this.paramsBusqueda.idLinea);

          this.rows = result.data.reporteMap || [];
          this.rowsGrafica = result.data.graficaMap || [];

          configChartSpider.series = [];
          configChartSpider.title.text = titulo;

          let esperada = [];
          let real = [];

          let esperadaTmp = this.rowsGrafica.filter((el) => el.padre == 0)[0];
          esperada.push(esperadaTmp.sppeda);
          esperada.push(esperadaTmp.sppedb);
          esperada.push(esperadaTmp.sppedc);
          esperada.push(esperadaTmp.sppedd);
          configChartSpider.series.push({ color: '#1a237e', name: ' Velocidad promedio ', data: esperada, pointPlacement: 'on' });

          this.viewReport = true;
          setTimeout(() => {
            this.rptAfterViewGenerate();
          }, 400);

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
    $('#chartSpider').highcharts(configChartSpider);
  }

  verTablas(event): void {
    event.preventDefault();
    this.ver_tabla = !this.ver_tabla;
    this.texto_link = this.ver_tabla ? "Ocultar tabla(s)" : "Ver datos en tabla(s)";
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

    if (linkFile.download != undefined) {
      document.body.appendChild(linkFile);
      let tabla = getTablaUtf8('tblReporte');
      linkFile.href = data_type + ', ' + tabla;
      linkFile.download = 'ReporteVelocidadPromedio';
      linkFile.click();
      linkFile.remove();
    } else {

      let elem = $("#tblReporte")[0].outerHTML;

      let blobObject = new Blob(["\ufeff", elem], { type: 'application/vnd.ms-excel' });
      window.navigator.msSaveBlob(blobObject, 'ReporteVelocidadPromedio.xls');
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

  getLinea(lineas: Array<Linea>, id_linea: number): string {
    let el = lineas.filter(el => el.id_linea == id_linea);

    if (el.length > 0) {
      return "  " + el[0].descripcion;
    } else {
      return "Linea no identificada"
    }
  }


}
