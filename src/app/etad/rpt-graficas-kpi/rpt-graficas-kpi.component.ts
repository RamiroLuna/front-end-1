import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { Catalogo } from '../../models/Catalogo';
import { AuthService } from '../../auth/auth.service';
import { Periodo } from '../../models/periodo';
import { clone } from '../../utils';
import { RptGraficasKpiService } from './rpt-graficas-kpi.service';
import { configChart } from './rpt.config.export';

declare var $: any;
declare var Materialize: any;


@Component({
  selector: 'app-rpt-graficas-kpi',
  templateUrl: './rpt-graficas-kpi.component.html',
  providers: [RptGraficasKpiService]
})
export class RptGraficasKpiComponent implements OnInit {

  public loading: boolean;
  public submitted: boolean;
  public viewReport: boolean;
  public formConsultaPeriodo: FormGroup;
  public paramsBusqueda: any;
  public etads: Array<Catalogo>;
  public tituloGrafica: string;
  public anios: Array<any>;
  public meses: Array<any>;
  public periodos: Array<Periodo>;
  public registros:Array<any>;
  public grupos:Array<Catalogo>;
  public suma_temporal:number;
  public graficas = [];


  constructor(
    private service: RptGraficasKpiService,
    private auth: AuthService,
    private fb: FormBuilder) { }

  ngOnInit() {

    this.loading = true;
    this.submitted = false;
    this.viewReport = false;
    this.registros = [];
    this.tituloGrafica = "";
    this.paramsBusqueda = {};

    this.anios = [];
    this.meses = [];
    this.periodos = [];
    this.grupos = [];
    this.graficas = [];


    this.service.getCatalogos(this.auth.getIdUsuario()).subscribe(result => {

      if (result.response.sucessfull) {
        this.etads = result.data.listEtads || [];
        this.grupos = result.data.listGrupos || [];

        this.grupos = this.grupos.filter(el=>el.id != 6 && el.id !=5);

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
      idEtad: new FormControl({ value: this.paramsBusqueda.idEtad }, [Validators.required]),
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
    this.registros = [];
    this.graficas = [];  


    if (this.formConsultaPeriodo.valid) {

      this.service.getGraficasByEtad(this.auth.getIdUsuario(), parametrosBusqueda).subscribe(result => {

        if (result.response.sucessfull) {
        
          let total_graficas = result.data.graficas || [];

          total_graficas.map((el)=>{
            let config_grafica = clone(configChart);
            let dataReal = [el.metaA,el.metaB,el.metaC,el.metaD];
            let dataEsperada = [el.resultadoA,el.resultadoB,el.resultadoC,el.resultadoD];

            config_grafica.series = [];
            config_grafica.xAxis.categories = ['A','B','C','D'];
            config_grafica.title.text = el.kpi;

            config_grafica.series.push({ name: ' Logro ', data: dataEsperada, color: '#dcedc8' });
            config_grafica.series.push({ name: ' Meta ', data: dataReal , type: 'line', color: '#1a237e' });

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
    this.graficas.forEach((configuracionGrafica, index)=>{
        $('#grafica'+index).highcharts(configuracionGrafica);
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
