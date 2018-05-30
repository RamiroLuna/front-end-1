import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { RptProduccionRealPlanService } from "./rpt-produccion-real-plan.service";
import { AuthService } from '../../auth/auth.service';
import { Periodo } from '../../models/periodo';
import { Catalogo } from '../../models/catalogo';
import { getTablaUtf8, clone, getFechaActual, calculaDiaPorMes } from '../../utils';
import { configChartSpider, configChart } from './rpt.config.export';
import { Linea } from '../../models/linea';

declare var $: any;
declare var Materialize: any;
@Component({
  selector: 'app-rpt-produccion-real-plan',
  templateUrl: './rpt-produccion-real-plan.component.html',
  providers: [RptProduccionRealPlanService]
})
export class RptProduccionRealPlanComponent implements OnInit {

  public loading: boolean;
  public submitted: boolean;
  public viewReport: boolean;
  public formConsultaPeriodo: FormGroup;
  public parametrosBusqueda: any;
  public anios: Array<any>;
  public meses: Array<any>;
  public periodos: Array<Periodo>;
  public lineas: Array<Linea>;
  public vista: Array<any>;
  public vercombo: boolean;



  constructor(
    private service: RptProduccionRealPlanService,
    private auth: AuthService,
    private fb: FormBuilder
  ) { }

  ngOnInit() {

    this.loading = true;
    this.submitted = false;
    this.viewReport = false;
    this.vercombo = true;
    this.parametrosBusqueda = {
      dia: ''
    };
    this.anios = [];
    this.meses = [];
    this.periodos = [];
    this.vista = [
      { value: 'byDays', text: 'DIA' },
      { value: 'byWeeks', text: 'SEMANA' },
      { value: 'byMonths', text: 'AÑO' },
    ];

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
      idPeriodo: new FormControl({ value: this.parametrosBusqueda.idPeriodo }, [Validators.required]),
      report: new FormControl({ value: this.parametrosBusqueda.report }, [Validators.required])
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
    $('#chartBarra').highcharts(configChart);
    $('#chartSpider').highcharts(configChartSpider);
  }

  changeCombo(params: string): void {
    this.viewReport = false;
    if (params == 'anio') {
      this.meses = this.periodos.filter(el => el.anio == this.parametrosBusqueda.anio);
     

    } else if (params == 'tipo') {
      this.vercombo = this.parametrosBusqueda.report == 'byMonths';
    }
  }

  busqueda(parametrosBusqueda: any) {
    this.viewReport = false;
    this.submitted = true;
    if (this.formConsultaPeriodo.valid) {

      this.service.reportePerformance(this.auth.getIdUsuario(), parametrosBusqueda).subscribe(result => {
        console.log('result', result)
        if (result.response.sucessfull) {

          let datos = result.data.reporteMap || [];
          let labels = datos.filter((el) => el.padre == 0).map(element => element.periodo);
          let dataReal = datos.filter((el) => el.padre == 0).map(element => element.real);
          let dataEsperada = datos.filter((el) => el.padre == 0).map(element => element.meta);
         

          let titulo = 'Desempeño por grupo '+ this.getLinea(this.lineas, this.parametrosBusqueda.idLinea);
          

          configChart.series = [];
          configChart.xAxis.categories = labels;
          configChart.title.text = titulo;

    
          configChart.series.push({ name: ' Producción real ', data: dataReal, color: '#c0ca33' });
          configChart.series.push({ name: ' Meta esperada ', data: dataEsperada, type: 'line', color: '#fff3e0' });

          let datosRRadar = result.data.graficaMap || [];
          configChartSpider.series = [];
          configChartSpider.title.text = titulo;
          let esperada= [];
          let real = [];

          let esperadaTmp = datosRRadar.filter((el) => el.padre == 0)[0];
          esperada.push(esperadaTmp.metaa);
          esperada.push(esperadaTmp.metab);
          esperada.push(esperadaTmp.metac);
          esperada.push(esperadaTmp.metad);

          let realTmp = datosRRadar.filter((el) => el.padre == 0)[0];
          real.push(realTmp.reala);
          real.push(realTmp.realb);
          real.push(realTmp.realc);
          real.push(realTmp.reald);
           
          configChartSpider.series.push({ color:'#1a237e', name: ' Meta esperada ', data: esperada, pointPlacement: 'on'});
          configChartSpider.series.push({ color: '#c0ca33' , name: ' Meta real ', data: real, pointPlacement: 'on'});

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


  regresar() {
    $('.tooltipped').tooltip('hide');
  }

  getPeriodo(periodos: Array<Periodo>, id_periodo: number): string {
    let el = periodos.filter(el => el.id_periodo == id_periodo);

    if (el.length > 0) {
      return "  " + el[0].descripcion_mes + "  " + el[0].anio;
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
