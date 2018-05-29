import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../../auth/auth.service';
import { Meta } from '../../models/meta';
import { deleteItemArray, getAnioActual, calculaDiaPorMes, isNumeroAsignacionValid, findRol } from '../../utils';
import swal from 'sweetalert2';
import { ListaMetasEdicionService } from './lista-metas-edicion.service';
import { Periodo } from '../../models/periodo';
import { Linea } from '../../models/linea';
import { Catalogo } from '../../models/catalogo';
import {
  trigger,
  state,
  style,
  animate,
  transition
} from '@angular/animations';


declare var $: any;
declare var Materialize: any;
@Component({
  selector: 'app-lista-metas-edicion',
  templateUrl: './lista-metas-edicion.component.html',
  providers: [ListaMetasEdicionService],
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
export class ListaMetasEdicionComponent implements OnInit {
  public loading: boolean;
  public datos_tabla: boolean;
  public mensajeModal: string;
  public estatusPeriodo: boolean;

  public anioSeleccionado: number;
  public submitted: boolean;
  public disabled: boolean;

  public periodos: Array<Periodo> = [];
  public lineas: Array<Linea> = [];
  public grupos: Array<Catalogo> = [];
  public turnos: Array<Catalogo> = [];
  public anios: any = {};
  public meses: Array<any> = [];
  public metas: Array<Meta> = [];
  public formConsultaPeriodo: FormGroup;
  public status: string;

  public idLinea: number;
  public idPeriodo: number;


  public permission: any = {
    editarMeta: false,
    eliminarMeta: false
  }

  constructor(private auth: AuthService,
    private service: ListaMetasEdicionService,
    private fb: FormBuilder
  ) { }

  ngOnInit() {
    this.loading = true;
    this.datos_tabla = false;
    this.submitted = false;
    this.disabled = false;
    this.estatusPeriodo = true;

    this.permission.editarMeta = findRol(3, this.auth.getRolesOee());
    this.permission.eliminarMeta = findRol(5, this.auth.getRolesOee());


    this.anioSeleccionado = getAnioActual();

    this.service.getInitCatalogos(this.auth.getIdUsuario()).subscribe(result => {

      if (result.response.sucessfull) {

        this.lineas = result.data.listLineas || [];
        this.periodos = result.data.listPeriodos || [];
        this.grupos = result.data.listGrupos || [];
        this.turnos = result.data.listTurnos || [];
        let tmpAnios = this.periodos.map(el => el.anio);
        this.periodos.filter((el, index) => {
          return tmpAnios.indexOf(el.anio) === index;
        }).forEach((el) => {
          let tmp = el.anio;
          this.anios[tmp] = tmp;
        });

        this.meses = this.periodos.filter(el => el.anio == this.anioSeleccionado);

        this.loading = false;
        this.loadFormulario();
        setTimeout(() => { this.ngAfterViewInitHttp() }, 200)
      } else {
        Materialize.toast('Ocurrió  un error al consultar catalogos!', 4000, 'red');
        this.loading = false;
      }
    }, error => {
      Materialize.toast('Ocurrió  un error en el servicio!', 4000, 'red');
      this.loading = false;
    });
  }



  /*
   * Carga plugins despues de cargar y mostrar objetos en el DOM
   */
  ngAfterViewInitHttp(): void {

    let mes: number = this.obtenerMesDelPeriodo(this.periodos, this.idPeriodo);
    let totalDias = calculaDiaPorMes(this.anioSeleccionado, mes);
    let argDias = [];

    for (let i = 1; i <= totalDias; i++) {
      argDias.push(i <= 9 ? "0" + i : i);
    }

    $("table tr").editable({
      maintainWidth: true,
      keyboard: false,
      dblclick: false,
      button: true,
      buttonSelector: ".edit",
      dropdowns: {
        "grupo": this.arrayDescriptivo(this.grupos),
        "turno": this.arrayDescriptivo(this.turnos),
        "dia": argDias
      },
      edit: function (values) {
        $('#tabla select').material_select();
      },
      save: (values) => {
        values.dia = values.dia + "/" + (mes < 9 ? "0" + mes : mes) + "/" + this.anioSeleccionado;
        values.grupo = this.idItemCombo(this.grupos, values.grupo);

        this.service.updateMeta(this.auth.getIdUsuario(), values).subscribe(result => {

          if (result.response.sucessfull) {
            Materialize.toast('Actualización completa', 4000, 'green');
          } else {
            let resetValues = this.findRowForecast(this.metas, values.id_meta);
            $('td[scope="3,' + values.index + '"]').html(resetValues.dia_string);
            $('td[scope="4,' + values.index + '"]').html(resetValues.id_turno);
            $('td[scope="5,' + values.index + '"]').html(resetValues.nombre_grupo);
            $('td[scope="6,' + values.index + '"]').html(resetValues.meta);
            $('td[scope="7,' + values.index + '"]').html(resetValues.tmp);
            $('td[scope="8,' + values.index + '"]').html(resetValues.velocidad);
            Materialize.toast(result.response.message, 4000, 'red');
          }
        }, error => {
          let resetValues = this.findRowForecast(this.metas, values.id_meta);
          $('td[scope="3,' + values.index + '"]').html(resetValues.dia_string);
          $('td[scope="4,' + values.index + '"]').html(resetValues.id_turno);
          $('td[scope="5,' + values.index + '"]').html(resetValues.nombre_grupo);
          $('td[scope="6,' + values.index + '"]').html(resetValues.meta);
          $('td[scope="7,' + values.index + '"]').html(resetValues.tmp);
          $('td[scope="8,' + values.index + '"]').html(resetValues.velocidad);
          Materialize.toast('Ocurrió un error en el servicio!', 4000, 'red');
        });




      },
      onSet: function (context) {

      }

    });

    $('.tooltipped').tooltip({ delay: 50 });

    /* Carga de evento para identificar quien esta siendo editado en la captura de meta*/
    $('.container').on('keyup', 'td[data-field="meta"] input[type="text"] , td[data-field="tmp"] input[type="text"] ,  td[data-field="velocidad"] input[type="text"] ', function () {

      let numero_renglon = $(this).parent('td').attr('scope').split(',')[1];

      let meta = $('td[scope="6,' + numero_renglon + '"] input[type="text"]').val().trim();
      let tmp = $('td[scope="7,' + numero_renglon + '"] input[type="text"]').val().trim();
      let velocidad = $('td[scope="8,' + numero_renglon + '"] input[type="text"]').val().trim();

      if (!isNumeroAsignacionValid(meta) || !isNumeroAsignacionValid(tmp) || !isNumeroAsignacionValid(velocidad)) {
        $('#btn' + numero_renglon).attr("disabled", true);
      } else {
        $('#btn' + numero_renglon).attr("disabled", false);
      }

    });

    $('.container').bind("contextmenu", function (e) {
      return false;
    });

  }




  agregar() {
    $('.tooltipped').tooltip('hide');
  }

  regresar() {
    $('.tooltipped').tooltip('hide');
  }

  changeIcono(event): void {
    let icono = $(event.target).html();
    $(event.target).html(icono == 'edit' ? 'save' : 'edit');

  }

  changeCombo(): void {
    this.estatusPeriodo = true;
    this.datos_tabla = false;
    this.status = "inactive";
  }

  openModalYear(event): void {
    event.preventDefault();
    swal({
      title: 'Seleccione el año',
      input: 'select',
      cancelButtonText: 'Cancelar',
      confirmButtonText: 'OK',
      inputOptions: this.anios,
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
            this.anioSeleccionado = value;
            this.meses = this.periodos.filter(el => el.anio == this.anioSeleccionado);
          } else {
            resolve('Seleccione un año')
          }
        })
      }
    })
  }

  loadFormulario(): void {
    this.formConsultaPeriodo = this.fb.group({
      idLinea: new FormControl({ value: this.idLinea }, [Validators.required]),
      idPeriodo: new FormControl({ value: this.idPeriodo }, [Validators.required])
    });
  }


  consultaPeriodo(): void {
    this.submitted = true;
    this.status = "inactive";

    if (this.formConsultaPeriodo.valid) {
      this.disabled = true;
      this.datos_tabla = false;

      this.service.getAllMetas(this.auth.getIdUsuario(), this.idPeriodo, this.idLinea).subscribe(result => {

        if (result.response.sucessfull) {
          this.estatusPeriodo = result.data.estatusPeriodo;
          this.metas = result.data.listMetas || [];
          this.datos_tabla = true;
          this.disabled = false;

          setTimeout(() => {
            this.ngAfterViewInitHttp();
            this.status = 'active';
          }, 200);


        } else {
          Materialize.toast('Ocurrió  un error al consultar las metas!', 4000, 'red');
        }
      }, error => {
        Materialize.toast('Ocurrió  un error en el servicio!', 4000, 'red');
      });

    } else {
      Materialize.toast('Se encontrarón errores!', 4000, 'red');
    }



  }

  openModalConfirmacion(rowForecast: Meta, accion: string, event?: any): void {
    this.mensajeModal = '';

    switch (accion) {
      case 'eliminar':
        this.mensajeModal = '¿Está seguro de eliminar? ';
        break;
    }

    /* 
     * Configuración del modal de confirmación
     */
    swal({
      title: '<span style="color: #303f9f ">' + this.mensajeModal + '</span>',
      type: 'question',
      html: '<p style="color: #303f9f "> Dia : <b>' + rowForecast.dia_string + ' </b>Turno: <b>' + rowForecast.id_turno + '</b> Grupo: <b>' + rowForecast.nombre_grupo + '</b></p>',
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
            this.service.delete(this.auth.getIdUsuario(), rowForecast.id_meta).subscribe(result => {
              if (result.response.sucessfull) {
                deleteItemArray(this.metas, rowForecast.id_meta, 'id_meta');
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

  findRowForecast(metas: Array<Meta>, id_meta: number): Meta {
    let meta: Meta;
    let el = metas.filter(el => el.id_meta == id_meta);
    if (el.length > 0) {
      meta = el[0];
    }
    return meta;
  }


}
