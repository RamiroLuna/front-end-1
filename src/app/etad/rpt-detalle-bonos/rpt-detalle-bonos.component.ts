import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../../auth/auth.service';
import { Periodo } from '../../models/periodo';
import { getTablaUtf8 } from '../../utils';
import { RptDetalleBonosService } from './rpt-detalle-bonos.service';

declare var $: any;
declare var Materialize: any;
@Component({
  selector: 'app-rpt-detalle-bonos',
  templateUrl: './rpt-detalle-bonos.component.html',
  styleUrls: ['rpt-detalle-bonos.component.css'],
  providers: [ RptDetalleBonosService ]
})
export class RptDetalleBonosComponent implements OnInit {

  public loading: boolean;
  public submitted: boolean;
  public viewReport: boolean;
  public formConsultaPeriodo: FormGroup;
  public paramsBusqueda: any;
  public anios: Array<any>;
  public meses: Array<any>;
  public periodos: Array<Periodo>;
  public registros: Array<any>;
  public titulo_tabla:string;
  public texto_busqueda:string = "";

  constructor(
    private service: RptDetalleBonosService,
    private auth: AuthService,
    private fb: FormBuilder) { }

  ngOnInit() {

    this.loading = true;
    this.submitted = false;
    this.viewReport = false;
    this.registros = [];
    this.paramsBusqueda = {};
    this.titulo_tabla = "";

    this.anios = [];
    this.meses = [];
    this.periodos = [];

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
    this.texto_busqueda = "";


    if (this.formConsultaPeriodo.valid) {

      this.service.getReporteBonoDetallado(this.auth.getIdUsuario(), parametrosBusqueda).subscribe(result => {
      
        if (result.response.sucessfull) {
          this.registros = result.data.bonos || [];
          this.registros = this.registros.filter(el=>el.padre==0);  
          this.titulo_tabla = " DETALLE BONOS DE "+ this.getPeriodo(this.periodos, parametrosBusqueda.idPeriodo);
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



  exportarExcel(): void {

    let linkFile = document.createElement('a');
    let data_type = 'data:application/vnd.ms-excel;';

    if (linkFile.download != undefined) {
      document.body.appendChild(linkFile);
      let tabla = getTablaUtf8('tblReporte');

      linkFile.href = data_type + ', ' + tabla;
      linkFile.download = 'ReporteBono';

      linkFile.click();
      linkFile.remove();
    } else {

      let elem = $("#tblReporte")[0].outerHTML;
      let blobObject = new Blob(["\ufeff", elem], { type: 'application/vnd.ms-excel' });
      window.navigator.msSaveBlob(blobObject, 'ReporteBono.xls');
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

  limpiarInput(){
    this.texto_busqueda="";
  }

}
