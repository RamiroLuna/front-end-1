import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { Linea } from '../../models/linea';
import { AuthService } from '../../auth/auth.service';
import { Periodo } from '../../models/periodo';
import { getTablaUtf8 } from '../../utils';
import { RptDetalladoFallasService } from './rpt-detallado-fallas.service';
import { Falla } from '../../models/falla';

declare var $: any;
declare var Materialize: any;
@Component({
  selector: 'app-rpt-detallado-fallas',
  templateUrl: './rpt-detallado-fallas.component.html',
  styleUrls: ['./rpt-detallado-fallas.component.css'],
  providers: [RptDetalladoFallasService]
})
export class RptDetalladoFallasComponent implements OnInit {

  public loading: boolean;
  public submitted: boolean;
  public viewReport: boolean;
  public formConsultaPeriodo: FormGroup;
  public paramsBusqueda: any;
  public lineas: Array<Linea>;
  public tituloGrafica: string;
  public fallas: Array<Falla>;
  public anios: Array<any>;
  public meses: Array<any>;
  public periodos: Array<Periodo>;
  public texto_busqueda: string = "";
  public total_horas: number;

  constructor(
    private service: RptDetalladoFallasService,
    private auth: AuthService,
    private fb: FormBuilder) { }

  ngOnInit() {

    this.loading = true;
    this.submitted = false;
    this.viewReport = false;
    this.fallas = [];
    this.tituloGrafica = "";
    this.paramsBusqueda = {};

    this.anios = [];
    this.meses = [];
    this.periodos = [];
    this.total_horas = 0;

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
    this.fallas = [];

    if (this.formConsultaPeriodo.valid) {

      this.service.reporteFallas(this.auth.getIdUsuario(), parametrosBusqueda).subscribe(result => {

        if (result.response.sucessfull) {
          this.fallas = result.data.listFallas || [];
          
          let total = this.fallas.map(el=>  parseFloat("" +el.tiempo_paro)).reduce((anterior,actual)=>{
            if (Number.isNaN(anterior) || typeof anterior == undefined) anterior = 0.00;
            if (Number.isNaN(actual) || typeof actual == undefined) actual = 0.00;
            return anterior + actual;
          });
          this.total_horas = parseFloat(total.toFixed(2));
          this.viewReport = true;

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

    if (linkFile.download != undefined) {
      document.body.appendChild(linkFile);
      let tabla = getTablaUtf8('tblReporte');

      linkFile.href = data_type + ', ' + tabla;
      linkFile.download = 'ReporteDetalladoFallas';

      linkFile.click();
      linkFile.remove();
    } else {

      let elem = $("#tblReporte")[0].outerHTML;
      let blobObject = new Blob(["\ufeff", elem], { type: 'application/vnd.ms-excel' });
      window.navigator.msSaveBlob(blobObject, 'ReporteDetalladoFallas.xls');
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

  limpiarInput() {
    this.texto_busqueda = "";
  }

}
