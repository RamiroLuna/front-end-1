import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { RptDiarioProduccionService } from "./rpt-diario-produccion.service";
import { AuthService } from '../../auth/auth.service';
import { Periodo } from '../../models/periodo';
import { Catalogo } from '../../models/catalogo';
import { getTablaUtf8 } from '../../utils';


declare var $: any;
declare var Materialize: any;
@Component({
  selector: 'app-rpt-diario-produccion',
  templateUrl: './rpt-diario-produccion.component.html',
  styleUrls: ['./rpt-diario-produccion.component.css'],
  providers: [RptDiarioProduccionService]
})
export class RptDiarioProduccionComponent implements OnInit {

  public loading: boolean;
  public submitted: boolean;
  public viewReport: boolean;
  public formConsultaPeriodo: FormGroup;
  public parametrosBusqueda: any;
  public rows: Array<any>;
  public anios: Array<any>;
  public meses: Array<any>;
  public periodos: Array<Periodo>;
  public gruposLineas: Array<Catalogo>;

  constructor(
    private service: RptDiarioProduccionService,
    private auth: AuthService,
    private fb: FormBuilder
  ) { }

  ngOnInit() {

    this.loading = true;
    this.submitted = false;
    this.viewReport = false;
    this.rows = [];
    this.parametrosBusqueda = {};
    this.anios = [];
    this.meses = [];
    this.periodos = [];
    this.gruposLineas = [];

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

  changeCombo(params: string): void {
    this.viewReport = false;
    if (params == 'anio') {
      this.meses = this.periodos.filter(el => el.anio == this.parametrosBusqueda.anio)
    }
  }

  busqueda(parametrosBusqueda: any) {

    this.viewReport = false;
    this.submitted = true;
    this.rows = [];

    if (this.formConsultaPeriodo.valid) {

      this.service.reporteProduccionDiaria(this.auth.getIdUsuario(), parametrosBusqueda).subscribe(result => {

        if (result.response.sucessfull) {
          this.rows = result.data.reporteDiario || [];
          this.viewReport = true;
          setTimeout(() => {

          }, 1000);

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


  exportarExcel(): void {
    let linkFile = document.createElement('a');
    let data_type = 'data:application/vnd.ms-excel;';

    if (linkFile.download != undefined) {
      document.body.appendChild(linkFile);

      let tablas = getTablaUtf8('tblReporte');

      linkFile.href = data_type + ', ' + tablas;
      linkFile.download = 'ReporteDiarioProduccion';

      linkFile.click();
      linkFile.remove();
    } else {

      let elem = $("#tblReporte")[0].outerHTML;

      let blobObject = new Blob(["\ufeff", elem], { type: 'application/vnd.ms-excel' });
      window.navigator.msSaveBlob(blobObject, 'ReporteDiarioProduccion.xls');
    }

  }


}
