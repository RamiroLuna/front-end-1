import { Component, OnInit, AfterViewInit } from '@angular/core';
import { MetaManualService } from './meta-manual.service';
import { AuthService } from '../../auth/auth.service';
import { Catalogo } from '../../models/catalogo';
import { Linea } from '../../models/linea';
import { PetCatKpiOperativo } from '../../models/pet-cat-kpi-operativo';
import { PetCatObjetivoOperativo } from '../../models/pet-cat-objetivo-operativo';
import { PetCatMetaEstrategica } from '../../models/pet-cat-meta-estrategica';
import { MetaKpi } from '../../models/meta-kpi';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { getMetasKPI, getFrecuenciaMetaKPI } from '../../utils';
import swal from 'sweetalert2';
import { Periodo } from '../../models/periodo';


declare var $: any;
declare var Materialize: any;
@Component({
  selector: 'app-meta-manual',
  styleUrls: ['./meta-manual.component.css'],
  templateUrl: './meta-manual.component.html',
  providers: [MetaManualService]
})
export class MetaManualComponent implements OnInit {

  /*
  * Listas requeridas para el formulario de metas
  */

  public etads: Array<Linea>;
  public metas_estrategicas: Array<PetCatMetaEstrategica>;
  public metas_operativas: Array<PetCatObjetivoOperativo>;
  public metas_kpi: Array<PetCatKpiOperativo>;
  public metasForSwal: any = {};
  public periodos: Array<Periodo> = [];
  public anios: Array<any> = [];
  public meses: Array<any> = [];

  /*
   * lista_temporal almacena el catalogo en base a la seleccion
   */
  public lista_temporal: Array<any>;

  /*
   * Fin
   */
  public tipoMetaSeleccionada: string;
  public loading: boolean;
  public formCargaManual: FormGroup;
  public submitted: boolean;
  public mensajeModal: string;
  public titulo_combo: string;
  public meta: MetaKpi;

  public tiposMeta: Array<any> = [];
  public frecuenciasDisponibles: Array<any> = [];
  public frecuencias: Array<any> = [];


  constructor(private service: MetaManualService,
    private auth: AuthService,
    private fb: FormBuilder
  ) { }

  ngOnInit() {
    this.loading = true;
    this.submitted = false;
    this.tipoMetaSeleccionada = 'ESTRATEGICAS';
    this.titulo_combo = 'Metas estrategicas';
    this.tiposMeta = getMetasKPI();
    this.frecuenciasDisponibles = getFrecuenciaMetaKPI();
    this.getFrecuencia(this.tipoMetaSeleccionada);
    this.meta = new MetaKpi();
    this.lista_temporal = [];

    /*
     * Consulta el elemento del catalogo
     */
    this.service.getCatalogos(this.auth.getIdUsuario()).subscribe(result => {
      console.log('carga manual init', result)
      if (result.response.sucessfull) {
        this.etads = result.data.listLineas || [];
        this.metas_kpi = result.data.listKPIOperativos || [];
        this.metas_estrategicas = result.data.listMetasEstrategicas || [];
        this.metas_operativas = result.data.listObjetivosOperativos || [];

        /*
         * Esto es solo al inicio para desokegar metas en el combo
         */
        this.lista_temporal = this.metas_estrategicas;
        this.meta.tipo_meta = 1;

        /*
         *
         */

        this.tiposMeta.map(el => {
          this.metasForSwal[el.descripcion] = el.descripcion;
        });

        this.periodos = result.data.listPeriodos || [];

        let tmpAnios = this.periodos.map(el => el.anio);
        this.anios = this.periodos.filter((el, index) => {
          return tmpAnios.indexOf(el.anio) === index;
        });

        this.meses = this.periodos.filter(el => el.anio == this.meta.anio);

        this.loading = false;
        this.loadFormulario();
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
  }

  loadFormulario(): void {
    this.formCargaManual = this.fb.group({
      id_etad: new FormControl({ value: this.meta.id_etad }, [Validators.required]),
      frecuencia: new FormControl({ value: this.meta.frecuencia }, [Validators.required]),
      anio: new FormControl({ value: this.meta.anio, disabled: true }, [Validators.required]),
      id_periodo: new FormControl({ value: this.meta.id_periodo, disabled: true }, [Validators.required]),
      id_option_meta: new FormControl({ value: this.meta.id_option_meta, disabled: true }, [Validators.required]),
      menos: new FormControl({ value: this.meta.menor, disabled: true }),
      mas: new FormControl({ value: this.meta.mas, disabled: true }),
      meta: new FormControl({ value: this.meta.meta }, [Validators.required, Validators.pattern(/^\d*(\.[0-9]{1,10})*$/)]),
      unidad_medida: new FormControl({ value: this.meta.unidad_medida, disabled: true })

    });
  }

  ngAfterViewInitHttp(): void {
    $('.tooltipped').tooltip({ delay: 50 });
  }

  openModalTipoMeta(event): void {
    event.preventDefault();
    swal({
      title: 'Seleccione tipo de meta',
      input: 'select',
      cancelButtonText: 'Cancelar',
      confirmButtonText: 'OK',
      inputOptions: this.metasForSwal,
      inputPlaceholder: 'SELECCIONE',
      showCancelButton: true,
      inputValidator: (value) => {

        return new Promise((resolve) => {

          this.submitted = false;

          if (value != '') {
            resolve();
            this.meta = new MetaKpi();
            this.formCargaManual.controls.anio.reset();
            this.formCargaManual.controls.id_periodo.reset();
            this.formCargaManual.controls.id_option_meta.reset();
            this.tipoMetaSeleccionada = value;
            this.meta.tipo_meta = this.getIdTipoMeta(this.tipoMetaSeleccionada);
            if (this.meta.tipo_meta == 1) {
              this.titulo_combo = 'Metas estrategicas';
            } else if (this.meta.tipo_meta == 2) {
              this.titulo_combo = 'Objetivo operativo';
            } else if (this.meta.tipo_meta == 3) {
              this.titulo_combo = 'KPI operativo';
            }
            this.getFrecuencia(this.tipoMetaSeleccionada);
          } else {
            resolve('Seleccione tipo de meta')
          }
        })
      }
    })
  }

  openModalConfirmacion(meta: MetaKpi, accion: string): void {

    this.submitted = true;
    this.mensajeModal = '';




    if (this.formCargaManual.valid) {

      switch (accion) {
        case 'add':
          this.mensajeModal = '¿Está seguro de agregar ? ';
          break;
      }
      /* 
       * Configuración del modal de confirmación
       */
      swal({
        title: '<span style="color: #303f9f ">' + this.mensajeModal + '</span>',
        type: 'question',
        html: '<p style="color: #303f9f "> Meta para el día : <b> </b> Linea: <b></b> Grupo: <b>' + +'</b> Valor: <b>' + +'</b></p>',
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
           * contenedor.meta Es una variable que se necesita por el backend
           */
          let contenedor: any = { meta: {}};
          let metaTemporal:MetaKpi = JSON.parse( JSON.stringify(meta));

          if (metaTemporal.tipo_meta == 1) {
              metaTemporal.metaEstrategica.valor = metaTemporal.meta;
              metaTemporal.metaEstrategica.id_meta_anual_estrategica = metaTemporal.id_option_meta;
          }else if(metaTemporal.tipo_meta == 2){

          }else if(metaTemporal.tipo_meta == 3){

          }

          delete metaTemporal.meta;
          delete metaTemporal.mas;
          delete metaTemporal.menor;
          delete metaTemporal.id_option_meta;
          delete metaTemporal.unidad_medida;

          contenedor.meta = metaTemporal;

          this.service.insertMetas(this.auth.getIdUsuario(), contenedor).subscribe(result => {
            if (result.response.sucessfull) {
              Materialize.toast('Se agregó correctamente', 4000, 'green');
              this.formCargaManual.reset();
              this.submitted = false;
            } else {
              Materialize.toast(result.response.message, 4000, 'red');
            }
          }, eror => {
            Materialize.toast('Ocurrió un error en el servicio!', 4000, 'red');
          });

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

  getFrecuencia(tipoMeta: string) {
    let temp = this.tiposMeta.filter((el) => el.descripcion == tipoMeta.trim().toUpperCase());

    if (temp.length > 0) {
      if (temp[0].frecuencia == 2) {
        this.frecuencias = this.frecuenciasDisponibles.map(el => el);
      } else {
        this.frecuencias = this.frecuenciasDisponibles.filter(element => element.id == temp[0].frecuencia);
      }
    }
  }

  getIdTipoMeta(tipoMeta: string): number {
    let temp = this.tiposMeta.filter((el) => el.descripcion == tipoMeta.trim().toUpperCase());
    if (temp.length > 0) {
      return temp[0].id;
    } else {
      return -1;
    }
  }



  getItemCatalogo(tipo: number, id: number): any {
    let element = {};
    let e;
    switch (tipo) {
      case 1:
        e = this.metas_estrategicas.filter(el => el.id == id);
        if (e.length > 0) element = e[0];
        break;
      case 2:
        e = this.metas_operativas.filter(el => el.id == id);
        if (e.length > 0) element = e[0];
        break;
      case 3:
        e = this.metas_kpi.filter(el => el.id == id);
        if (e.length > 0) element = e[0];
        break;
    }

    return element;
  }

  regresar() {
    $('.tooltipped').tooltip('hide');
  }

  changeCombo(tipoCombo: string): void {

    if (tipoCombo == 'frecuencia') {

      if (this.meta.frecuencia == 'mensual') {
        if (this.meta.tipo_meta == 1) {
          this.lista_temporal = this.metas_estrategicas.filter(el => el.mensual == 1)
        }
        this.formCargaManual.controls.id_periodo.enable();
        this.formCargaManual.controls.anio.enable();
        this.formCargaManual.controls.id_option_meta.enable();
      } else if (this.meta.frecuencia == 'anual') {
        if (this.meta.tipo_meta == 1) {
          this.lista_temporal = this.metas_estrategicas.filter(el => el.anual == 1)
        } else if (this.meta.tipo_meta == 2) {
          this.lista_temporal = this.metas_operativas;
        } else if (this.meta.tipo_meta == 3) {
          this.lista_temporal = this.metas_kpi;
        }
        this.formCargaManual.controls.id_periodo.disable();
        this.formCargaManual.controls.anio.enable();
        this.formCargaManual.controls.id_option_meta.enable();
      } else {
        this.formCargaManual.controls.id_option_meta.disable();
        this.formCargaManual.controls.id_periodo.disable();
        this.formCargaManual.controls.anio.disable();
        this.lista_temporal = [];
      }

    } else if (tipoCombo == 'lista') {
      let obj = this.getItemCatalogo(this.meta.tipo_meta, this.meta.id_option_meta);
      if (this.meta.tipo_meta == 3) {
        this.meta.mas = obj.tipo_kpi;
        this.meta.menor = obj.tipo_kpi;
      } else {
        this.meta.mas = -1;
        this.meta.menor = -1;
      }

      this.meta.unidad_medida = obj.unidad_medida || 'N/A';
    }

  }


}
