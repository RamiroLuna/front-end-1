import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../../auth/auth.service';
import { deleteItemArray, getAnioActual, calculaDiaPorMes, isNumeroAsignacionValid, findRol } from '../../utils';
import swal from 'sweetalert2';
import { ListaIshikawasService } from './lista-ishikawas.service';
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
import { PetIshikawa } from '../../models/pet-ishikawa';

declare var $: any;
declare var Materialize: any;
@Component({
  selector: 'app-lista-ishikawas',
  templateUrl: './lista-ishikawas.component.html',
  providers: [ListaIshikawasService],
  styleUrls: ['./lista-ishikawas.component.css'],
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
export class ListaIshikawasComponent implements OnInit {

  public loading: boolean;
  public datos_tabla: boolean;
  public mensajeModal: string;
  public estatusPeriodo: boolean;
  public anioSeleccionado: number;
  public submitted: boolean;
  public disabled: boolean;
  public periodos: Array<Periodo> = [];
  public anios: any = {};
  public meses: Array<any> = [];
  public formConsultaPeriodo: FormGroup;
  public status: string;
  public idLinea: number;
  public idPeriodo: number;
  public recordsIshikawa: Array<PetIshikawa>;
  public $modalFormIshikawa: any;

  /* Catalogos requeridos y varibales para visualizar formulario detalle */
  public consultaById: boolean;
  public bloquear: boolean;
  public emes: Array<Catalogo>;
  public preguntas: Array<Catalogo>;
  public etads: Array<Catalogo>;
  public grupos: Array<Catalogo>;
  public ishikawa: PetIshikawa;
  public action: string;
  /* Fin catalogos requeridos */


  public permission: any = {
    editarIshikawa: true,
    finalizar: true
  }

  constructor(private auth: AuthService,
    private service: ListaIshikawasService,
    private fb: FormBuilder
  ) { }

  ngOnInit() {
    this.loading = true;
    this.datos_tabla = false;
    this.submitted = false;
    this.disabled = false;
    this.estatusPeriodo = true;
    this.consultaById = false;
    this.bloquear = true;
    this.recordsIshikawa = [];
    this.action = '';
    // this.permission.editarIshikawa = findRol(3, this.auth.getRolesOee());

    this.anioSeleccionado = getAnioActual();

    this.service.getInitCatalogos(this.auth.getIdUsuario()).subscribe(result => {

      if (result.response.sucessfull) {

        this.etads = result.data.listEtads || [];
        this.periodos = result.data.listPeriodos || [];

        this.emes = result.data.listMs || [];
        this.preguntas = result.data.listPreguntas || [];
        this.grupos = result.data.listGrupos || [];

        let tmpAnios = this.periodos.map(el => el.anio);
        this.periodos.filter((el, index) => {
          return tmpAnios.indexOf(el.anio) === index;
        }).forEach((el) => {
          let tmp = el.anio;
          this.anios[tmp] = tmp;
        });

        this.meses = this.periodos.filter(el => el.anio == this.anioSeleccionado);

        this.loading = false;
        // this.loadFormulario();

        setTimeout(() => {
          this.ngAfterViewInitHttp();
        }, 200);

      } else {
        Materialize.toast(result.response.message, 4000, 'red');
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
    $('.tooltipped').tooltip({ delay: 50 });
    this.$modalFormIshikawa = $('#modalFormIshikawa').modal({
      opacity: 0.6,
      inDuration: 800,
      dismissible: false,
      complete: () => { }
    });

    this.consultaPeriodo();

  }

  agregar() {
    $('.tooltipped').tooltip('hide');
  }

  regresar() {
    $('.tooltipped').tooltip('hide');
  }


  changeCombo(): void {
    this.estatusPeriodo = true;
    this.datos_tabla = false;
    this.status = "inactive";
    this.recordsIshikawa = [];
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

          if (value != '') {
            resolve();
            this.anioSeleccionado = value;
            this.submitted = false;
            this.status = "inactive";
            this.datos_tabla = false;
            this.recordsIshikawa = [];
            this.consultaPeriodo();
          } else {
            resolve('Seleccione un año')
          }
        })
      }
    })
  }


  consultaPeriodo(): void {
    this.submitted = true;
    this.status = "inactive";
    this.disabled = true;
    this.datos_tabla = false;
    this.recordsIshikawa = [];

    this.service.getAllIshikawas(this.auth.getIdUsuario(), this.anioSeleccionado).subscribe(result => {

      if (result.response.sucessfull) {
        this.recordsIshikawa = result.data.listIshikawas || [];
        this.datos_tabla = true;
        this.disabled = false;

        setTimeout(() => {
          this.status = 'active';
        }, 200);


      } else {
        this.disabled = false;
        Materialize.toast(result.response.message, 4000, 'red');
      }
    }, error => {
      this.disabled = false;
      Materialize.toast('Ocurrió  un error en el servicio!', 4000, 'red');
    });

  }

  verificaIshikawa(data):void{
      this.openModalConfirmacion(data.ishikawa, 'verificar');
  }

  openModalConfirmacion(ishikawa: PetIshikawa, accion: string, event?: any): void {
    this.mensajeModal = '';

    switch (accion) {
      case 'eliminar':
        this.mensajeModal = '¿Está seguro de eliminar ishikawa? ';
        break;
      case 'verificar':
        this.mensajeModal = '¿Está seguro de finalizar ishikawa? ';
        break;
    }

    /* 
     * Configuración del modal de confirmación
     */
    swal({
      title: '<span style="color: #303f9f ">' + this.mensajeModal + '</span>',
      type: 'question',
      html: '<p style="color: #303f9f ">Día registro: <b>' + ishikawa.fecha_string + '</b> Área etad: <b>' + ishikawa.etad.valor + '</b> Grupo: <b>' + ishikawa.grupo.valor + '</b></p>',
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
            this.service.deleteIshikawa(this.auth.getIdUsuario(), ishikawa).subscribe(result => {
              if (result.response.sucessfull) {
                deleteItemArray(this.recordsIshikawa, ishikawa.id, 'id');
                Materialize.toast('Se eliminó correctamente ', 4000, 'green');
              } else {
                Materialize.toast(result.response.message, 4000, 'red');
              }
            }, error => {
              Materialize.toast('Ocurrió  un error en el servicio!', 4000, 'red');
            });
            break;
          case 'verificar':
            this.service.checkIshikawa(this.auth.getIdUsuario(), ishikawa).subscribe(result => {
           
              if (result.response.sucessfull) {
                ishikawa.estatus = 1
                this.ishikawa = ishikawa;
                this.recordsIshikawa.filter(el=>el.id == ishikawa.id)[0].estatus = 1;
  
                Materialize.toast('Finalizó ishikawa correctamente ', 4000, 'green');
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

  openModalDetalle(ishikawa: PetIshikawa, action: string): void {

    this.action = action;
    this.bloquear = ('consult' == this.action);
    this.consultaById = false;
    this.ishikawa = new PetIshikawa();

    this.service.getIshikawaById(this.auth.getIdUsuario(), ishikawa.id).subscribe(result => {
      if (result.response.sucessfull) {
        this.ishikawa = result.data.ishikawa;
        this.consultaById = true;
        this.$modalFormIshikawa.modal('open');
      } else {
        Materialize.toast(result.response.message, 4000, 'red');
      }
    }, error => {
      Materialize.toast('Ocurrió  un error en el servicio!', 4000, 'red');
    });

  }

  closeModalFormulario(): void {
    this.$modalFormIshikawa.modal('close');
    this.consultaById = false;
  }

  help(event): void {
    $('.tooltipped').tooltip('hide');
    event.preventDefault();
    swal({
      title: 'Ayuda',
      type: 'info',
      html: ' Para <b>editar</b> un ishikawa haga clic en el botón <i class="material-icons">edit</i> <br>' +
        '<b>Solo podra editar si el ishikawa no ha sido verificado</b></br>' +
        'Para <b>verficar</b> haga clic en el botón <i class="material-icons">list</i> <br>'+
        '<b> La verificación se habilitará un día después de la fecha más lejana registrada en el plan de acción</b> <br><br>'+
        ' El formato <b>PDF</b> se habilitará cuando el ishikawa este finalizado',
      showCloseButton: false,
      showCancelButton: false,
      focusConfirm: false,
      confirmButtonText: 'Ok!'
    })

  }


  /*
   * 
   * 
   */
  viewPDF(ishikawa:PetIshikawa):void{
    alert();
  }


}
