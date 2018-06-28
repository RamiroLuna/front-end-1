import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../../auth/auth.service';
import swal from 'sweetalert2';
import { ListaMetasService } from './lista-metas.service';
import { Periodo } from '../../models/periodo';
import { Linea } from '../../models/linea';
import { Catalogo } from '../../models/catalogo';
import {
  arrayObjectIndexOf,
  calculaDiaPorMes,
  isNumeroAsignacionValid,
  findRol,
  getMetasKPI,
  getFrecuenciaMetaKPI,
  clone
} from '../../utils';
import {
  trigger,
  state,
  style,
  animate,
  transition
} from '@angular/animations';
import { MetaKpi } from '../../models/meta-kpi';
import { PetMetaAnualEstrategica } from '../../models/pet-meta-anual-estrategica';
import { PetMetaAnualObjetivoOperativo } from '../../models/pet-meta-anual-objetivo-operativo';
import { PetMetaAnualKpi } from '../../models/pet-meta-anual-kpi';


declare var $: any;
declare var Materialize: any;

@Component({
  selector: 'app-lista-metas',
  templateUrl: './lista-metas.component.html',
  providers: [ListaMetasService],
  animations: [
    trigger('visibility', [
      state('inactive', style({
        opacity: 0
      })),
      state('active', style({
        opacity: 1
      })),
      transition('inactive => active', animate('1s ease-in')),
      transition('active => inactive', animate('500ms ease-out'))
    ])
  ]
})
export class ListaMetasComponent implements OnInit {

  public loading: boolean;
  public datos_tabla: boolean;
  public mensajeModal: string;

  public anioSeleccionado: any;
  public frecuencia: string;
  public submitted: boolean;
  public disabled: boolean;
  public tipoMetaSeleccionada: string;

  public tiposMeta: Array<any> = [];
  public frecuenciasDisponibles: Array<any> = [];
  public frecuencias: Array<any> = [];
  public periodos: Array<Periodo> = [];
  public etads: Array<Linea> = [];
  public grupos: Array<Catalogo> = [];
  public turnos: Array<Catalogo> = [];
  public anios: Array<any> = [];
  public meses: Array<any> = [];
  public metas: Array<MetaKpi> = [];
  public formConsultaPeriodo: FormGroup;
  public status: string;

  public idEtad: number;
  public idPeriodo: any;
  public metasForSwal: any = {};


  public permission: any = {
    editarMeta: true,
    eliminarMeta: true
  }

  constructor(private auth: AuthService,
    private service: ListaMetasService,
    private fb: FormBuilder
  ) { }

  ngOnInit() {
    this.loading = true;
    this.datos_tabla = false;
    this.submitted = false;
    this.disabled = false;

    this.permission.editarMeta = findRol(3, this.auth.getRolesOee());
    this.permission.eliminarMeta = findRol(5, this.auth.getRolesOee());

    this.tiposMeta = getMetasKPI();
    this.frecuenciasDisponibles = getFrecuenciaMetaKPI();

    this.tipoMetaSeleccionada = 'ESTRATEGICAS';
    this.getFrecuencia(this.tipoMetaSeleccionada)


    this.service.getInitCatalogos(this.auth.getIdUsuario()).subscribe(result => {

      if (result.response.sucessfull) {

        this.etads = result.data.listLineas || [];
        this.periodos = result.data.listPeriodos || [];
        this.grupos = result.data.listGrupos || [];
        this.grupos = this.grupos.filter((el) => el.id != 6);
        this.turnos = result.data.listTurnos || [];
        let tmpAnios = this.periodos.map(el => el.anio);
        this.periodos.filter((el, index) => {
          return tmpAnios.indexOf(el.anio) === index;
        }).forEach((el) => {
          let tmp = el.anio;
          this.anios.push({ value: tmp, descripcion: tmp })
        });

        this.tiposMeta.map(el => {
          this.metasForSwal[el.descripcion] = el.descripcion;
        })

        this.meses = this.periodos.filter(el => el.anio == this.anioSeleccionado);

        this.loading = false;
        this.loadFormulario();
        // setTimeout(() => { this.ngAfterViewInitHttp() }, 200)
      } else {
        Materialize.toast(result.response.message, 4000, 'red');
        this.loading = false;
      }
    }, error => {
      Materialize.toast('Ocurrió  un error en el servicio!', 4000, 'red');
      this.loading = false;
    });
  }

  agregar() {
    $('.tooltipped').tooltip('hide');
  }

  regresar() {
    $('.tooltipped').tooltip('hide');
  }

  changeIcono(event, tipo: number): void {
    let icono = $(event.target).html();
    let id = $(event.target).attr('id');

    if (icono == 'edit') {

      $(event.target).html(icono == 'edit' ? 'save' : 'edit');
      $('#text' + id).attr('disabled', false);

    } else if (icono == 'save') {
      let caja = $('#text' + id);

      if (isNumeroAsignacionValid(caja.val())) {
        let meta: any;
        /*
         * Busca meta que se esta editando
         */
        meta = clone(this.metas[id]);
        meta.valor = parseFloat(caja.val().trim()).toFixed(3);

        /* 
         * Se forma el modelo a enviar al backend
         * contenedor.meta Es una variable que se necesita por el backend
         */
        let contenedor: any = { meta: {} };
        contenedor.meta = meta;

        this.service.update(this.auth.getIdUsuario(), contenedor, this.frecuencia, tipo).subscribe(result => {
          if (result.response.sucessfull) {
            /*
             * Da el formato de tres decimales
             */ 
            caja.val(parseFloat(caja.val().trim()).toFixed(3));
            /* 
             *
             */  
            $(event.target).html(icono == 'edit' ? 'save' : 'edit');
            caja.attr('disabled', true);

            Materialize.toast('Se actualizó correctamente ', 4000, 'green');
          } else {
            Materialize.toast(result.response.message, 4000, 'red');
          }
        }, error => {
          Materialize.toast('Ocurrió  un error en el servicio!', 4000, 'red');
        });

      } else {
        Materialize.toast('Valor de meta no valido', 4000, 'red');
      }
    }

  }

  changeCombo(tipoCombo: string): void {
    this.datos_tabla = false;
    this.status = "inactive";

    if (tipoCombo == 'frecuencia') {
      this.idPeriodo = '';
      this.anioSeleccionado = '';
      if (this.frecuencia == 'mensual') {
        this.formConsultaPeriodo.controls.idPeriodo.enable();
        this.formConsultaPeriodo.controls.anioSeleccionado.enable();
      } else if (this.frecuencia == 'anual') {
        this.formConsultaPeriodo.controls.idPeriodo.disable();
        this.formConsultaPeriodo.controls.anioSeleccionado.enable();
      } else {
        this.formConsultaPeriodo.controls.idPeriodo.disable();
        this.formConsultaPeriodo.controls.anioSeleccionado.disable();
      }

    } else if (tipoCombo == 'anio') {
      this.meses = this.periodos.filter(el => el.anio == this.anioSeleccionado);
    }

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
          this.formConsultaPeriodo.reset();
          this.submitted = false;
          this.status = "inactive";
          this.datos_tabla = false;

          if (value != '') {
            resolve();
            this.tipoMetaSeleccionada = value;
            this.getFrecuencia(this.tipoMetaSeleccionada);
          } else {
            resolve('Seleccione tipo de meta')
          }
        })
      }
    })
  }

  loadFormulario(): void {
    this.formConsultaPeriodo = this.fb.group({
      frecuencia: new FormControl({ value: this.frecuencia }, [Validators.required]),
      anioSeleccionado: new FormControl({ value: this.anioSeleccionado }, [Validators.required]),
      idEtad: new FormControl({ value: this.idEtad }, [Validators.required]),
      idPeriodo: new FormControl({ value: this.idPeriodo }, [Validators.required])
    });
  }

  consultaPeriodo(): void {
    this.submitted = true;
    this.status = "inactive";

    if (this.formConsultaPeriodo.valid) {
      this.disabled = true;
      this.datos_tabla = false;
      let idTipoMeta = this.tiposMeta.filter((el) => el.descripcion == this.tipoMetaSeleccionada.trim().toUpperCase())[0].id;
      this.service.getAllMetas(this.auth.getIdUsuario(), this.idPeriodo, this.idEtad, this.anioSeleccionado, this.frecuencia, idTipoMeta).subscribe(result => {

        if (result.response.sucessfull) {

          if (result.data.metasEstrategicas) {
            this.metas = result.data.metasEstrategicas.ListMetaEstrategica || [];
          } else if (result.data.metasKPIOperativos) {
            this.metas = result.data.metasKPIOperativos.listKPIOperativo || [];
          } else if (result.data.metasObjetivosOperativos) {
            this.metas = result.data.metasObjetivosOperativos.listObjetivoOperativo || [];
          }

          this.datos_tabla = true;
          this.disabled = false;

          setTimeout(() => {
            // this.ngAfterViewInitHttp();
            this.status = 'active';
          }, 200);


        } else {
          Materialize.toast(result.response.message, 4000, 'red');
          this.disabled = false;
        }
      }, error => {
        Materialize.toast('Ocurrió  un error en el servicio!', 4000, 'red');
        this.disabled = false;
      });

    } else {
      Materialize.toast('Verifique los datos capturados!', 4000, 'red');
    }

  }

  openModalConfirmacion(meta: any, accion: string, tipo_meta: string, event?: any): void {
    this.mensajeModal = '';
    let html = '<div style="color: #303f9f"> <p> tipo-meta : <b>:meta-descriptivo:</b></p><p>para el Etad: <b>:etad-descriptivo:</b></p></div>';
    let id_tipo_meta = 0;
    switch (accion) {
      case 'eliminar':
        this.mensajeModal = '¿ Está seguro de eliminar ? ';
        break;
    }

    switch (tipo_meta) {
      case 'estrategica':
        id_tipo_meta = 1;
        let meta_tmp = meta as PetMetaAnualEstrategica;
        html = html.replace(/:meta-descriptivo:/g, meta_tmp.metaEstrategica.valor).replace(/:etad-descriptivo:/g, meta_tmp.linea.valor).replace(/tipo-meta/g, 'Meta estretegica');
        break;
      case 'operativas':
        id_tipo_meta = 2;
        let meta_tmp2 = meta as PetMetaAnualObjetivoOperativo;
        html = html.replace(/:meta-descriptivo:/g, meta_tmp2.objetivoOperativo.valor).replace(/:etad-descriptivo:/g, meta_tmp2.linea.valor).replace(/tipo-meta/g, 'Objetivo operativo');;
        break;
      case 'kpi':
        id_tipo_meta = 3;
        let meta_tmp3 = meta as PetMetaAnualKpi;
        html = html.replace(/:meta-descriptivo:/g, meta_tmp3.kPIOperativo.valor).replace(/:etad-descriptivo:/g, meta_tmp3.linea.valor).replace(/tipo-meta/g, 'KPI Operativo');;
        break;
    }

    /* 
     * Configuración del modal de confirmación
     */
    swal({
      title: '<span style="color: #303f9f ">' + this.mensajeModal + '</span>',
      type: 'question',
      html: html,
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
        switch (accion) {
          case 'eliminar':
            /* 
             * Se forma el modelo a enviar al backend
             * contenedor.meta Es una variable que se necesita por el backend
             */
            let contenedor: any = { meta: {} };
            contenedor.meta = meta;
            this.service.delete(this.auth.getIdUsuario(), contenedor, this.frecuencia, id_tipo_meta).subscribe(result => {
              if (result.response.sucessfull) {
                switch (id_tipo_meta) {
                  case 1:
                    let meta_tmp = meta as PetMetaAnualEstrategica;
                    this.deleteItemArray(this.metas, meta_tmp.id_meta_anual_estrategica, 'id_meta_anual_estrategica', 1);
                    break;
                  case 2:
                    let meta_tmp2 = meta as PetMetaAnualObjetivoOperativo;
                    this.deleteItemArray(this.metas, meta_tmp2.id_meta_anual_objetivo_operativo, 'id_meta_anual_objetivo_operativo', 2);
                    break;
                  case 3:
                    let meta_tmp3 = meta as PetMetaAnualKpi;
                    this.deleteItemArray(this.metas, meta_tmp3.id_meta_anual_kpi, 'id_meta_anual_kpi', 3);
                    break;
                }
                Materialize.toast('Se eliminó correctamente ', 4000, 'green');
              } else {
                Materialize.toast(result.response.message, 4000, 'red');
              }
            }, error => {
              Materialize.toast('Ocurrió  un error en el servicio!', 4000, 'red');
            });
            break;
        }
        /*
        * Si cancela accion
        */
      } else if (result.dismiss === swal.DismissReason.cancel) {
      }
    })

  }

  deleteItemArray(arreglo, valor, propiedad, tipo): void {
    if (arreglo.length > 0) {
      let exist = arrayObjectIndexOf(arreglo, valor, propiedad);
      if (exist != -1) {
        arreglo.splice(exist, 1);
      }
    }
  }

  obtenerMesDelPeriodo(arg: Array<Periodo>, idPeriodo: number): number {
    let result = arg.filter((el) => el.id_periodo == idPeriodo);
    if (result.length > 0) {
      return result[0].mes;
    } else {
      return -1;
    }
  }

  arrayDescriptivo(arg: Array<Catalogo>): Array<string> {
    return arg.map((el) => el.valor);
  }

  idItemCombo(arg: Array<Catalogo>, valor: string): number {
    let element = arg.filter((el) => el.valor == valor.trim());
    if (element.length > 0) {
      return element[0].id;
    } else {
      return -1;
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



}
