import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../../auth/auth.service';
import { Forecast } from '../../models/forecast';
import { deleteItemArray, getAnioActual, calculaDiaPorMes, isNumeroAsignacionValid } from '../../utils';
import swal from 'sweetalert2';
import { ListaMetasEdicionService } from './lista-metas-edicion.service';
import { Periodo } from '../../models/periodo';
import { Linea } from '../../models/linea';
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
  public forecast: Array<Forecast>;
  public anioSeleccionado: number;
  public submitted: boolean;
  public disabled: boolean;

  public periodos: Array<Periodo> = [];
  public lineas: Array<Linea> = [];
  public anios: any = {};
  public meses: Array<any> = [];
  public metas: Array<Forecast> = [];
  public formConsultaPeriodo: FormGroup;
  public status: string;

  public idLinea: number;
  public idPeriodo: number;

  constructor(private auth: AuthService,
    private service: ListaMetasEdicionService,
    private fb: FormBuilder
  ) { }

  ngOnInit() {
    this.loading = true;
    this.datos_tabla = false;
    this.submitted = false;
    this.disabled = false;

    this.anioSeleccionado = getAnioActual();

    this.service.getInitCatalogos(this.auth.getIdUsuario()).subscribe(result => {

      if (result.response.sucessfull) {
        this.lineas = result.data.listLineas || [];
        this.periodos = result.data.listPeriodos || [];
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

  public variableGlobal: any;

  /*
   * Carga plugins despues de cargar y mostrar objetos en el DOM
   */
  ngAfterViewInitHttp(): void {

    let mes: number = this.obtenerMesDelPeriodo(this.periodos, this.idPeriodo);
    let totalDias = calculaDiaPorMes(this.anioSeleccionado, mes);

    let disable: Array<any> = [];
    disable.push(true);
    for (let i = 1; i <= totalDias; i++) {
      disable.push(new Date(this.anioSeleccionado, mes - 1, i));
    }

    $("table tr").editable({
      maintainWidth: true,
      keyboard: false,
      dblclick: false,
      button: true,
      buttonSelector: ".edit",
      dropdowns: {
        "grupo": ['A', 'B', 'C', 'D'],
        "turno": [1, 2, 3]
      },
      edit: function (values) {

        $('td#' + values.index + ' input[type="text"]').attr("data-value", values.dia);

        // $('td[data-field="meta"] input[type="text"]').keyup(function() {
        //   alert( "Handler for .keyup() called." );
        // });

        $('#tabla select').material_select();

        $('td#' + values.index + ' input[type="text"]').pickadate({
          selectYears: false,
          selectMonths: false,
          clear: '',
          format: 'dd/mm/yyyy',
          monthsFull: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
          monthsShort: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
          weekdaysShort: ['Dom', 'Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab'],
          weekdaysLetter: ['D', 'L', 'M', 'M', 'J', 'V', 'S'],
          disable: disable,
          onClose: function (context) {

          },
          onSet: (context) => {

            this.variableGlobal = $('td#' + values.index + ' input[type="text"]').val();

          }
        });



      },
      save: function (values) {
        values.dia = this.variableGlobal;
        if (values.dia == undefined || values.dia == "") {
          values.dia = values.dia_string;
        }

        console.log(values)
        setTimeout(() => {
          $('td#' + values.index).html(values.dia), 10
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
          this.forecast = [];

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
          this.metas = result.data.listMetas || [];
          this.datos_tabla = true;
          this.disabled = false;

          setTimeout(() => {
            this.ngAfterViewInitHttp();
            this.status = 'active';
          }, 20);


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

  openModalConfirmacion(rowForecast: Forecast, accion: string, event?: any): void {
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
      html: '<p style="color: #303f9f "> Dia : <b>' + rowForecast.dia + ' </b>Turno: <b>' + rowForecast.turno + '</b> Grupo: <b>' + rowForecast.grupo + '</b></p>',
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
                deleteItemArray(this.forecast, rowForecast.id_meta, 'id_pro_meta');
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

  editar(rowForecast: Forecast): void {

  }

}
