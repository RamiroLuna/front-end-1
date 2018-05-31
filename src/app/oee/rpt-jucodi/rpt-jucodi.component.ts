import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { RptJucodiService } from "./rpt-jucodi.service";
import { AuthService } from '../../auth/auth.service';
import { Periodo } from '../../models/periodo';
import { Catalogo } from '../../models/catalogo';
import { getTablaUtf8, clone, getFechaActual , calculaDiaPorMes } from '../../utils';
import { configChart } from './rpt.config.export';
import swal from 'sweetalert2';

declare var $: any;
declare var Materialize: any;
@Component({
  selector: 'app-rpt-jucodi',
  templateUrl: './rpt-jucodi.component.html',
  styleUrls: ['./rpt-jucodi.component.css'],
  providers: [RptJucodiService]

})
export class RptJucodiComponent implements OnInit {

  public loading: boolean;
  public submitted: boolean;
  public viewReport: boolean;
  public formConsultaPeriodo: FormGroup;
  public parametrosBusqueda: any;
  public anios: Array<any>;
  public meses: Array<any>;
  public periodos: Array<Periodo>;
  public gruposLineas: Array<Catalogo>;
  public datos: Array<any>;
  public tituloGrafica: any;
  public datosConfiguracion: Array<any>;
  public rows: Array<any>;
  public rowsTmp: Array<any>;
  public verJuntaDiaria:boolean;


  constructor(
    private service: RptJucodiService,
    private auth: AuthService,
    private fb: FormBuilder
  ) { }

  ngOnInit() {

    this.loading = true;
    this.submitted = false;
    this.viewReport = false;
    this.parametrosBusqueda = {
      dia: ''
    };
    this.anios = [];
    this.meses = [];
    this.periodos = [];
    this.gruposLineas = [];
    this.tituloGrafica = '';
    this.datosConfiguracion = [];
    this.rows = [];
    this.rowsTmp = [];
    this.verJuntaDiaria = false;

    this.service.getCatalogos(this.auth.getIdUsuario()).subscribe(result => {

      if (result.response.sucessfull) {
        this.gruposLineas = result.data.listGposLineas || [];
        this.gruposLineas = this.gruposLineas.filter(el => el.id != 4).map(el => el);
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
      idGpoLinea: new FormControl({ value: this.parametrosBusqueda.idGpoLinea }, [Validators.required]),
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

  rptAfterViewGenerate(): void {
    for (let i = 0; i <= this.datos.length - 1; i++) {
      $('#chart' + i).highcharts(this.datosConfiguracion[i]);
    }

    $('.carousel.carousel-slider').carousel({
      fullWidth: true,
      indicators: true,
      duration: 400,
      onCycleTo: (ele, dragged) => {
        $('.carousel li').css('background-color', '#bdbdbd');
        $('.carousel .indicators .indicator-item.active').css('background-color', '#757575');

      }
    });

    $('.carousel li').css('background-color', '#bdbdbd');
    $('.carousel .indicators .indicator-item.active').css('background-color', '#757575');

  }

  changeCombo(params: string): void {
    this.viewReport = false;
    if (params == 'anio') {
      this.meses = this.periodos.filter(el => el.anio == this.parametrosBusqueda.anio)
    }
  }

  busqueda(parametrosBusqueda: any) {
    this.verJuntaDiaria = false;
    this.viewReport = false;
    this.submitted = true;
    this.datosConfiguracion = [];


    if (this.formConsultaPeriodo.valid) {

      this.service.reporteDailyPerformance(this.auth.getIdUsuario(), parametrosBusqueda).subscribe(result => {

        if (result.response.sucessfull) {
          this.datos = result.data.reporteDailyPerformance;
          for (let i = 0; i <= this.datos.length - 1; i++) {

            let confTmp = clone(configChart);
            let datosPorLinea = this.datos[i];

            let titulo = datosPorLinea[0].titulo_grafica;
            let labels = datosPorLinea.filter((el) => el.padre == 0).map(element => element.dia);
            let dataGrupoA = datosPorLinea.filter((el) => el.padre == 0).map((el) => el.a);
            let dataGrupoB = datosPorLinea.filter((el) => el.padre == 0).map((el) => el.b);
            let dataGrupoC = datosPorLinea.filter((el) => el.padre == 0).map((el) => el.c);
            let dataGrupoD = datosPorLinea.filter((el) => el.padre == 0).map((el) => el.d);
            let dataMeta1 = datosPorLinea.filter((el) => el.padre == 0).map((el) => el.meta1);
            let dataMeta2 = datosPorLinea.filter((el) => el.padre == 0).map((el) => el.meta2);
            let dataMeta3 = datosPorLinea.filter((el) => el.padre == 0).map((el) => el.meta3);

            confTmp.series = [];
            confTmp.xAxis.categories = labels;
            confTmp.title.text = titulo;
            confTmp.subtitle.text = 'Periodo: ' + this.getPeriodo(this.periodos, parametrosBusqueda.idPeriodo);

            confTmp.series.push({ name: ' A ', data: dataGrupoA, color: '#4db6ac' });
            confTmp.series.push({ name: ' B ', data: dataGrupoB, color: '#66bb6a' });
            confTmp.series.push({ name: ' C ', data: dataGrupoC, color: '#78909c' });
            confTmp.series.push({ name: ' D ', data: dataGrupoD });
            confTmp.series.push({ name: ' Meta 1ro ', data: dataMeta1, type: 'line', color: '#64b5f6' });
            confTmp.series.push({ name: ' Meta 2do ', data: dataMeta2, type: 'line', color: '#e0f2f1' });
            confTmp.series.push({ name: ' Meta dia ', data: dataMeta3, type: 'line', color: '#fff3e0' });
            this.datosConfiguracion.push(confTmp);
          }
          
      
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

  reporteJUCODI(parametrosBusqueda:any): void {
    this.verJuntaDiaria = false;
    this.service.reporteJUCODI(this.auth.getIdUsuario(), parametrosBusqueda).subscribe(result => {

      if (result.response.sucessfull) {
        this.verJuntaDiaria = true;
        this.rows = result.data.reporteDesempeno || [];        
        this.rowsTmp = result.data.reporteMap || [];        
      } else {
        Materialize.toast(result.response.message, 4000, 'red');
      }
    }, error => {
    });
  }

  regresar() {
    $('.tooltipped').tooltip('hide');
  }


  exportarExcel(): void {
    let linkFile = document.createElement('a');
    let data_type = 'data:application/vnd.ms-excel;';

    let tablas = getTablaUtf8('tblReporte') + getTablaUtf8('tblReporteTmp');

    linkFile.href = data_type + ', ' + tablas;
    linkFile.download = 'ReporteJucodi';

    linkFile.click();
    linkFile.remove();

  }

  getPeriodo(periodos: Array<Periodo>, id_periodo: number): string {
    let el = periodos.filter(el => el.id_periodo == id_periodo);

    if (el.length > 0) {
      return "  " + el[0].descripcion_mes + "  " + el[0].anio;
    } else {
      return "Linea no identificada"
    }
  }

  changeDia():void{
    let mes: number = this.obtenerMesDelPeriodo(this.periodos, this.parametrosBusqueda.idPeriodo);
    let totalDias = calculaDiaPorMes(this.parametrosBusqueda.anio, mes);
    let argDias = {};

    for (let i = 1; i <= totalDias; i++) {
      let dia =  i <= 9 ? '0' + i : i;
      argDias[i]= dia;
    }

    swal({
      title: 'Seleccione un día del periodo ' + this.getPeriodo(this.periodos,this.parametrosBusqueda.idPeriodo),
      input: 'select',
      cancelButtonText: 'Cancelar',
      confirmButtonText: 'OK',
      inputOptions: argDias,
      inputPlaceholder: 'SELECCIONE',
      showCancelButton: true,
      inputValidator: (value) => {

        return new Promise((resolve) => {
        
          if (value != '') {
            resolve();
            let fecha = (value <= 9 ? '0' + value : value) + '/' + (mes <= 9 ? '0' + mes : mes) + '/' + this.parametrosBusqueda.anio;
            this.parametrosBusqueda.dia = fecha;
            this.reporteJUCODI( this.parametrosBusqueda);
          
          } else {
            resolve('Seleccione un dia')
          }
        })
      }
    })

  
  }

  obtenerMesDelPeriodo(arg: Array<Periodo>, idPeriodo: number): number {
    let result = arg.filter((el) => el.id_periodo == idPeriodo);
    if (result.length > 0) {
      return result[0].mes;
    } else {
      return -1;
    }
  }

}
