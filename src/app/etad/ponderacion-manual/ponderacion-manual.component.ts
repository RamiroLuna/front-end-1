import { Component, OnInit, AfterViewInit } from '@angular/core';
import { PonderacionManualService } from './ponderacion-manual.service';
import { AuthService } from '../../auth/auth.service';
import { Catalogo } from '../../models/catalogo';
import { Linea } from '../../models/linea';
import { PetCatKpiOperativo } from '../../models/pet-cat-kpi-operativo';
import { PetCatObjetivoOperativo } from '../../models/pet-cat-objetivo-operativo';
import { PetCatMetaEstrategica } from '../../models/pet-cat-meta-estrategica';
import { PetPonderacionObjetivoOperativo } from '../../models/pet-ponderacion-objetivo-operativo';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { clone, deleteItemArray, isNumeroAsignacionValid } from '../../utils';
import swal from 'sweetalert2';
import { Periodo } from '../../models/periodo';
import { ActivatedRoute, Router } from '@angular/router';
import { PonderacionKpiOperativos } from '../../models/ponderacion-kpi-operativos';


declare var $: any;
declare var Materialize: any;
@Component({
  selector: 'app-ponderacion-manual',
  templateUrl: './ponderacion-manual.component.html',
  styleUrls: ['ponderacion-manual.component.css'],
  providers: [PonderacionManualService]
})
export class PonderacionManualComponent implements OnInit {

  /*
  * Listas requeridas para el formulario de metas
  */

  public etads: Array<Catalogo>;
  public anios: Array<any> = [];
  public catalogo_objetivos: Array<PetCatObjetivoOperativo>;
  public ponderacion_total: number;
  public row_pond_objetivos: Array<PetPonderacionObjetivoOperativo> = [];

  // tipo_meta_manual almacena que formulario se va a mostrar, recibe parametro por url
  public tipo_meta_manual: string;

  public loading: boolean;
  public formCargaManual: FormGroup;
  public submitted: boolean;
  public mensajeModal: string;
  public disabledBtn: boolean;
  public bVistaPre: boolean;

  //rows almacena los kpi asignados a las areas
  public rows: Array<PonderacionKpiOperativos> = [];

  //params contiene los datos de busqueda
  public params: any;

  //agregar si hay ponderacion registrada false en caso contrario true
  public agregar: boolean;

  //disabledBtnAgregar su valor es true si todas las ponderaciones de kpi es correcta  
  public disabledBtnAgregar: boolean;

  constructor(private service: PonderacionManualService,
    private route: ActivatedRoute,
    private router: Router,
    private auth: AuthService,
    private fb: FormBuilder
  ) { }

  ngOnInit() {
    this.loading = true;
    this.submitted = false;
    this.params = {};
    this.ponderacion_total = 0;
    this.disabledBtn = true;
    this.bVistaPre = false;
    this.disabledBtnAgregar = true;

    this.route.paramMap.subscribe(params => {
      this.tipo_meta_manual = params.get('tipo');

      /*
   * Consulta el elemento del catalogo
   */
      this.service.getCatalogos(this.auth.getIdUsuario()).subscribe(result => {

        if (result.response.sucessfull) {

          if (this.tipo_meta_manual == 'kpi-operativo') {
            this.etads = result.data.listEtads || [];
            this.anios = result.data.yearsForKPI || [];
          } else if (this.tipo_meta_manual == 'objetivo-operativo') {
            this.anios = result.data.listYears || [];
            this.catalogo_objetivos = result.data.listObjetivosOperativos || [];
            this.catalogo_objetivos.map(el => {
              let item = new PetPonderacionObjetivoOperativo();
              item.objetivoOperativo.valor = el.valor;
              item.id_objetivo_operativo = el.id;
              item.ponderacion = 0;
              item.anio = -1;

              this.row_pond_objetivos.push(item);
            });
          }


          this.loading = false;
          this.loadFormulario(this.tipo_meta_manual);
          setTimeout(() => { this.ngAfterViewInitHttp() }, 200)
        } else {
          Materialize.toast(result.response.message, 4000, 'red');
          this.loading = false;
        }
      }, error => {
        this.loading = false;
        Materialize.toast('Ocurrió un error en el servicio!', 4000, 'red');
      });
      /*
       * Fin carga de catalogos necesarios para el formulario
       */


    });

  }

  loadFormulario(tipo_meta_manual: string): void {
    if (tipo_meta_manual == 'objetivo-operativo') {
      this.formCargaManual = this.fb.group({
        anio: new FormControl({ value: this.params.anio }, [Validators.required])
      });
    } else if (this.tipo_meta_manual == 'kpi-operativo') {
      this.formCargaManual = this.fb.group({
        anio: new FormControl({ value: this.params.anio }, [Validators.required]),
        idEtad: new FormControl({ value: this.params.idEtad }, [Validators.required])
      });
    }
  }

  ngAfterViewInitHttp(): void {
    $('.tooltipped').tooltip({ delay: 50 });
  }

  somethingChanged(ponderacion: any): void {
    this.ponderacion_total = 0;
    let valores_ponderacion = this.row_pond_objetivos.map(el => parseInt("" + el.ponderacion));

    this.ponderacion_total = valores_ponderacion.reduce((valor_anterior, valor_actual) => {

      if (Number.isNaN(valor_anterior) || typeof valor_anterior == undefined) valor_anterior = 0;
      if (Number.isNaN(valor_actual) || typeof valor_actual == undefined) valor_actual = 0;
      return valor_anterior + valor_actual;
    });

    this.disabledBtn = !(this.ponderacion_total == 100);
  }

  somethingChangedKPI(ponderacion: any, control: number): void {
    let kpis_por_objetivo = this.rows.filter(el => el.control == control);

    let ponderacion_por_kpi = kpis_por_objetivo.filter(el => el.padre == 1).map(el => parseInt("" + el.ponderacion));

    this.ponderacion_total = 0;
    this.ponderacion_total = this.rows.filter(el => el.padre == 1).map(el => parseInt("" + el.ponderacion)).reduce((valor_anterior, valor_actual) => {
      if (Number.isNaN(valor_anterior) || typeof valor_anterior == undefined) valor_anterior = 0;
      if (Number.isNaN(valor_actual) || typeof valor_actual == undefined) valor_actual = 0;
      return valor_anterior + valor_actual;
    });

    let total_kpi = ponderacion_por_kpi.reduce((valor_anterior, valor_actual) => {

      if (Number.isNaN(valor_anterior) || typeof valor_anterior == undefined) valor_anterior = 0;
      if (Number.isNaN(valor_actual) || typeof valor_actual == undefined) valor_actual = 0;
      return valor_anterior + valor_actual;

    });


    let el = this.rows.filter(el => el.padre == 0 && el.control == control)[0];

    el.suma_ok = (total_kpi == el.ponderacion);

    this.disabledBtnAgregar = !(this.rows.filter(el => el.padre == 0).map(el => el.suma_ok).reduce((anterior, actual) => {
      return anterior && actual;
    }));

  }

  onlyNumber(event: any): boolean {
    let charCode = (event.which) ? event.which : event.keyCode;
    if (charCode < 48 || charCode > 57) {
      return false;
    }
  }

  openModalConfirmacion(accion: string, tipo_ponderacion: string): void {

    this.submitted = true;
    this.mensajeModal = '';

    if (this.formCargaManual.valid) {

      switch (tipo_ponderacion) {
        case 'objetivos_operativos':
          this.mensajeModal = '¿Está seguro de agregar ponderación a los objetivos operativos?';
          break;
        case 'kpi-operativo':
          this.mensajeModal = '¿Está seguro de agregar ponderación a los KPI\'s operativos?';
          break;
      }
      /* 
       * Configuración del modal de confirmación
       */
      swal({
        title: '<span style="color: #303f9f ">' + this.mensajeModal + '</span>',
        type: 'question',
        html: '<p style="color: #303f9f ">Año:<b>' + this.params.anio + '</b>  Area Etad: <b>' + this.getDescriptivoArea(this.params.idEtad) +
          '</b></p>',
        showCancelButton: true,
        confirmButtonColor: '#303f9f',
        cancelButtonColor: '#9fa8da ',
        cancelButtonText: 'Cancelar',
        confirmButtonText: 'Si!',
        allowOutsideClick: false,
        allowEnterKey: false
      }).then((result) => {
        /*
         * Si acepta
         */

        if (result.value) {
          /* 
               * Se forma el modelo a enviar al backend
               * contenedor.ponderaciones Es una variable que se necesita por el backend
               */
          let contenedor: any = { ponderaciones: {} };

          switch (tipo_ponderacion) {
            case 'objetivos_operativos':
              this.row_pond_objetivos.map(el => {
                if (Number.isNaN(parseInt("" + el.ponderacion)) || el.ponderacion == undefined) {
                  el.ponderacion = 0;
                }
              });

              contenedor.ponderaciones = this.row_pond_objetivos;
              this.service.insertPonderacion(this.auth.getIdUsuario(), 1, contenedor).subscribe(result => {
                if (result.response.sucessfull) {
                  Materialize.toast('Se agregarón ponderaciones correctamente', 4000, 'green');

                  this.row_pond_objetivos = [];

                  this.catalogo_objetivos.map(el => {
                    let item = new PetPonderacionObjetivoOperativo();
                    item.objetivoOperativo.valor = el.valor;
                    item.id_objetivo_operativo = el.id;
                    item.ponderacion = 0;
                    item.anio = -1;
                    this.row_pond_objetivos.push(item);
                  });

                  deleteItemArray(this.anios, parseInt(this.params.anio), 'result');

                  this.formCargaManual.controls.anio.reset();
                  this.ponderacion_total = 0;
                  this.disabledBtn = true;

                } else {
                  Materialize.toast(result.response.message, 4000, 'red');
                }
              }, eror => {
                Materialize.toast('Ocurrió un error en el servicio!', 4000, 'red');
              });
              break;

            case 'kpi-operativo':
             //setea un valor vacio o indefinido a 0. Evita error en el backend 
              this.rows.map(el => {
                if (Number.isNaN(parseInt("" + el.ponderacion)) || el.ponderacion == undefined) {
                  el.ponderacion = 0;
                }
              });
              // Solo envia los kpi
              contenedor.ponderaciones = this.rows.filter(el=>el.padre == 1);
              this.service.insertPonderacion(this.auth.getIdUsuario(), 2, contenedor,this.params).subscribe(result => {
                if (result.response.sucessfull) {
                  Materialize.toast('Se agregarón ponderaciones correctamente', 4000, 'green');
                 this.agregar = true;
                 this.disabledBtnAgregar = true;
              
                } else {
                  Materialize.toast(result.response.message, 4000, 'red');
                }
              }, eror => {
                Materialize.toast('Ocurrió un error en el servicio!', 4000, 'red');
              });

              break;
          }

          /*
          * Si cancela accion
          */
        } else if (result.dismiss === swal.DismissReason.cancel) {
        }
      })

    } else {
      Materialize.toast('Verifique los datos capturados!', 4000, 'red');
    }

  }



  regresar() {
    $('.tooltipped').tooltip('hide');
  }

  changeCombo(tipoCombo: string): void {
    this.row_pond_objetivos.map(el => {
      el.anio = this.params.anio
    });

  }

  changeComboKPI(tipo_combo: string): void {
    this.bVistaPre = false;
    this.disabledBtnAgregar = true;
  }

  getDescriptivoArea(idAreaEtad:number):string{
    let el = this.etads.filter(el=>el.id == idAreaEtad);
    if(el.length > 0){
      return el[0].valor;
    }else{
      return "No identificada";
    }
  }

  consultaKpi(): void {
    this.ponderacion_total = 0;
    this.submitted = true;
    this.mensajeModal = '';
    this.bVistaPre = false;

    if (this.formCargaManual.valid) {
      this.service.getPonderacion(this.auth.getIdUsuario(), 2, this.params.anio, this.params.idEtad).subscribe(result => {
      
        if (result.response.sucessfull) {
          this.rows = result.data.listData || [];

          if (this.rows.length > 0) {
            //objetivo_operativo permite controlar que kpi coresponde al objetivo operativo
            let objetivo_operativo = 0;
            // el siguiente ciclo permite agrupar el objetivo operativo y sus kpi mediante la varible control
            let tmp_ponderaciones = this.rows.filter(el => {
              if (el.padre == 0) objetivo_operativo++;
              el.control = objetivo_operativo;
              el.suma_ok = false;
              return el.padre == 1;
            }).map(el => el.ponderacion);

            this.ponderacion_total = tmp_ponderaciones.reduce((anterior, actual) => {
              if (!isNumeroAsignacionValid("" + anterior)) anterior = 0;
              if (!isNumeroAsignacionValid("" + actual)) actual = 0;
              return anterior + actual;
            });


            this.agregar = (this.ponderacion_total == 100);
          }

          this.bVistaPre = true;
        } else {
          Materialize.toast(result.response.message, 4000, 'red');
        }
      }, eror => {
        Materialize.toast('Ocurrió un error en el servicio!', 4000, 'red');
      });

    } else {
      Materialize.toast('Verifique los datos capturados!', 4000, 'red');
    }
  }

  
  help(event): void {
    $('.tooltipped').tooltip('hide');
    event.preventDefault();
    swal({
      title: 'Ayuda',
      type: 'info',
      html: ' <b> Para asignar ponderaciones </b> seleccione el año, el area y haga clic en buscar <br>' +
        ' Recuerde que para mostrar los KPI\'s <b>deben cargarse OBJETIVOS OPERATIVOS previamente </b> ',
      showCloseButton: false,
      showCancelButton: false,
      focusConfirm: false,
      confirmButtonText: 'Ok!'
    })

  }




}
