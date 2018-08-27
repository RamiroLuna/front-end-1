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
import * as pdfMake from 'pdfmake/build/pdfmake.js';
import * as pdfFonts from 'pdfmake/build/vfs_fonts.js';
import { PetConsenso } from '../../models/pet-consenso';
import {
  getImageHeader,
  getSteepOne,
  getSteepTwo,
  getSteepThree,
  getSteepFour,
  getSteepFive,
  getSteepSix,
  getImageBackground
} from '../img-base64-pdf/images.base64.pdf';
import { PetIdeas } from '../../models/pet-ideas';
import { PetPlanAccion } from '../../models/pet-plan-accion';
pdfMake.vfs = pdfFonts.pdfMake.vfs;

pdfMake.vfs = pdfFonts.pdfMake.vfs;

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
  public image_src: string;
  public imageForPdf:boolean;


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
    this.image_src = '../../../assets/diagrama_ishikawa.png';
    this.imageForPdf = false;


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

  verificaIshikawa(data): void {
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
      html: '<p style="color: #303f9f ">Descripción ishikawa: <b>' + ishikawa.descripcion_corta + '</b></p>',
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

                this.ishikawa = result.data.ishikawa;
                this.recordsIshikawa.forEach((el, index, arg) => {
                  if (el.id == ishikawa.id) {
                    arg[index] = this.ishikawa;
                  }
                });

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
        'Para <b>verficar</b> haga clic en el botón <i class="material-icons">list</i> <br>' +
        '<b> La verificación se habilitará un día después de la fecha más lejana registrada en el plan de acción</b> <br><br>' +
        ' El formato <b>PDF</b> se habilitará cuando el ishikawa este finalizado',
      showCloseButton: false,
      showCancelButton: false,
      focusConfirm: false,
      confirmButtonText: 'Ok!'
    })

  }


  updateIshikawa(data: any): void {

    this.ishikawa = data.ishikawa;
    /* 
     * Configuración del modal de confirmación
     */
    swal({
      title: '<span style="color: #303f9f ">¿Está seguro de actualizar ishikawa?</span>',
      type: 'question',
      input: 'text',
      inputPlaceholder: 'Escribe aquí',
      html: '<p style="color: #303f9f ">Ingrese descripción corta para identificar el registro</b></p>',
      showCancelButton: true,
      confirmButtonColor: '#303f9f',
      cancelButtonColor: '#9fa8da ',
      cancelButtonText: 'Cancelar',
      confirmButtonText: 'Si!',
      inputValue: this.ishikawa.descripcion_corta,
      allowOutsideClick: false,
      allowEnterKey: false,
      inputValidator: (value) => {

        if (!value) {
          return 'Se requiere descripción!';
        } else {
          if (value.length > 30) {
            return 'Máximo 30 caracteres';
          } else {
            this.ishikawa.descripcion_corta = value;
          }
        }
      }
    }).then((result) => {
      /*
       * Si acepta
       */
      if (result.value) {

        this.service.updateIshikawa(this.auth.getIdUsuario(), this.ishikawa).subscribe(result => {
          if (result.response.sucessfull) {
            let id_old = this.ishikawa.id;
            let id = parseInt(result.response.message);
            this.ishikawa.id = id;
            this.recordsIshikawa.forEach((el, index, arg) => {
              if (el.id == id_old) {
                arg[index] = this.ishikawa;
              }
            });
            Materialize.toast(' Se actualizo correctamente ', 5000, 'green');
          } else {
            Materialize.toast(result.response.message, 4000, 'red');
          }
        }, error => {
          Materialize.toast('Ocurrió  un error en el servicio!', 4000, 'red');
        });
        /*
        * Si cancela accion
        */
      } else if (result.dismiss === swal.DismissReason.cancel) {
      }
    });

  }

  revisaIshikawa(data: any): void {
    /* 
     * Configuración del modal de confirmación
     */
    swal({
      title: '<span style="color: #303f9f ">¿Está seguro de marcar ishikawa como revisado? </span>',
      type: 'question',
      html: '<p style="color: #303f9f "><b>Si confirma esta acción su nombre quedará registrado</b></p>',
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

        this.service.revisarIshikawa(this.auth.getIdUsuario(), data.ishikawa).subscribe(result => {

          if (result.response.sucessfull) {

            this.ishikawa.estatus = 1;
            this.ishikawa.revisado = result.data.ishikawa.revisado;
            this.ishikawa.verificar = result.data.ishikawa.verificar;

            this.recordsIshikawa.forEach((el, index, arg) => {
              if (el.id == data.ishikawa.id) {
                arg[index].estatus = 1;
                arg[index].revisado = result.data.ishikawa.reviso;
              }
            });
            Materialize.toast('Ishikawa revisado ', 4000, 'green');
          } else {
            Materialize.toast(result.response.message, 4000, 'red');
          }
        }, error => {
          Materialize.toast('Ocurrió  un error en el servicio!', 4000, 'red');
        });

        /*
        * Si cancela accion
        */
      } else if (result.dismiss === swal.DismissReason.cancel) {
      }
    })

  }



  /*
   * 
   * 
   */

  viewPDF(ishikawa: PetIshikawa): void {
    this.imageForPdf= true;
    console.log('imagen en base 64', this.getDiagramaBase64())
    var dd = {

      header: [
        {
          alignment: 'center',
          height: 45,
          image: getImageHeader()
        }
      ],

      content: [
        '\n',
        //Descripción del problema
        {

          alignment: 'center',
          width: 220,
          image: getSteepOne()

        },
        '\n',
        {
          alignment: 'center',
          columns: [
            {
              style: 'tabla',
              table: {
                widths: [220],
                body: [
                  [{ text: 'Nombre ETAD', style: 'fuenteTabla' }],
                  [{ text: ishikawa.nombre_etad, style: 'textoTabla' }]
                ]
              }
            },
            {
              style: 'tabla',
              table: {
                widths: [220],
                body: [
                  [{ text: 'Grupo', style: 'fuenteTabla' }],
                  [{ text: ishikawa.grupo.valor, style: 'textoTabla' }]
                ]
              }
            },
            {
              style: 'tabla',
              table: {
                widths: [220],
                body: [
                  [{ text: 'Área', style: 'fuenteTabla' }],
                  [{ text: ishikawa.etad.valor, style: 'texttoTabla' }]
                ]
              }
            }
          ]
        },
        '\n',
        {
          alignment: 'center',
          columns: [
            {
              text: 'Definición del problema',
              style: 'fuente'
            },
            {
              text: ''
            }
          ]
        },
        '\n',
        {
          alignment: 'center',
          columns: [
            {
              style: 'tabla',
              table: {
                widths: [350],
                heights: ['*', 30, '*', 30, '*', 30, '*', 30],
                body: [

                  [{ text: '¿Qué situación se presenta?', style: 'fuenteTabla' }],
                  [{ text: ishikawa.que, style: 'textoTabla' }],
                  [{ text: '¿Dónde se presenta la situación?', style: 'fuenteTabla' }],
                  [{ text: ishikawa.donde, style: 'textoTabla' }],
                  [{ text: '¿Cuándo se presenta?', style: 'fuenteTabla' }],
                  [{ text: ishikawa.cuando, style: 'textoTabla' }],
                  [{ text: '¿Cómo afecta la situación?', style: 'fuenteTabla' }],
                  [{ text: ishikawa.como, style: 'textoTabla' }]
                ]
              }
            }
            ,
            {
              style: 'tabla',

              table: {
                widths: [370],
                heights: ['*', 200],
                body: [
                  [{ text: 'Define el enunciado del problema', style: 'fuenteTabla' }],
                  [{ text: ishikawa.problema, style: 'textoTabla' }],
                ]
              }
            }
          ]
        },
        '\n\n\n\n\n\n\n\n\n',
        //Lluvia de ideas
        {
          alignment: 'center',
          width: 220,
          image: getSteepTwo()

        },
        '\n',
        {
          style: 'tabla',
          table: {
            alignment: 'center',
            widths: [750],
            heights: ['*', 40, '*', 40, '*', 40, '*', 40, '*', 40, '*', 40],
            body: [
              [{ text: 'Mano de Obra', style: 'fuenteTabla' }],
              [{ text: ishikawa.listIdeas.filter(el => el.id_eme == 1).map(el => el.idea).toString(), style: 'textoTabla' }],
              [{ text: 'Maquinaria', style: 'fuenteTabla' }],
              [{ text: ishikawa.listIdeas.filter(el => el.id_eme == 2).map(el => el.idea).toString(), style: 'textoTabla' }],
              [{ text: 'Mediciones', style: 'fuenteTabla' }],
              [{ text: ishikawa.listIdeas.filter(el => el.id_eme == 3).map(el => el.idea).toString(), style: 'textoTabla' }],
              [{ text: 'Método', style: 'fuenteTabla' }],
              [{ text: ishikawa.listIdeas.filter(el => el.id_eme == 4).map(el => el.idea).toString(), style: 'textoTabla' }],
              [{ text: 'Material', style: 'fuenteTabla' }],
              [{ text: ishikawa.listIdeas.filter(el => el.id_eme == 5).map(el => el.idea).toString(), style: 'textoTabla' }],
              [{ text: 'Medio Ambiente', style: 'fuenteTabla' }],
              [{ text: ishikawa.listIdeas.filter(el => el.id_eme == 6).map(el => el.idea).toString(), style: 'textoTabla' }]
            ]
          }
        },
        '\n\n\n',
        //Diagrama de ishikawa
        {
          alignment: 'center',
          width: 220,
          image: getSteepThree()
        },
        '\n\n',
        {
          alignment: 'center',
          width: 650,
          image: 'data:image/png;base64,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'
        },
        '\n\n\n\n\n',
        //Test de causa raíz  
        {
          alignment: 'center',
          width: 220,
          image: getSteepFour()

        },
        '\n\n',
        {
          alignment: 'center',
          columns: [
            {
              style: 'tabla',
              table: {
                widths: [350],
                heights: ['*', 200],
                body: [
                  [{ text: 'Describe la causa raíz', style: 'fuenteTabla' }],
                  [{ text: ishikawa.causa_raiz, style: 'textoTabla' }]
                ]
              }
            },
            {
              style: 'tabla',
              table: {
                widths: [270, 40, 40],
                heights: ['*', 50, 50, 50, 50, 50, 50, 50],
                body: [
                  [{ text: 'Text de causa raíz', style: 'fuenteTabla' }, { text: 'Sí', style: 'fuenteTabla' }, { text: 'No', style: 'fuenteTabla' }],
                  [{ text: '¿El enunciado de la causa raíz idenrifica a algún elemento del proceso?', style: 'textoTabla' }, { text: 'X', style: 'textoTabla' }, { text: '', style: 'textoTabla' }],
                  [{ text: '¿Es controlable la causa raíz?', style: 'textoTabla' }, { text: 'X', style: 'textoTabla' }, { text: '', style: 'textoTabla' }],
                  [{ text: '¿Se puede preguntar "por qué" otra vez y obtener otra causa raíz controlable?', style: 'textoTabla' }, { text: '', style: 'textoTabla' }, { text: 'X', style: 'textoTabla' }],
                  [{ text: '¿La causa raíz identificada es la falla fundamental del proceso?', style: 'textoTabla' }, { text: 'X', style: 'textoTabla' }, { text: '', style: 'textoTabla' }],
                  [{ text: 'Si corregimos o mejoramos la causa raíz identificada, ¿Asegurará que el problema identificado no vuelva a ocurrir?', style: 'textoTabla' }, { text: 'X', style: 'textoTabla' }, { text: '', style: 'textoTabla' }],
                  [{ text: '¿Hemos identificado la causa raíz del prblema?', style: 'textoTabla' }, { text: 'X', style: 'textoTabla' }, { text: '', style: 'textoTabla' }],
                  [{ text: 'Ya checamos que nuestra causa raíz identificada sea aplicable para más de una parte o proceso', style: 'textoTabla' }, { text: 'X', style: 'textoTabla' }, { text: '', style: 'textoTabla' }]
                ]
              }
            }
          ]
        },
        '\n\n',
        //Tabla guia ADTP y plan de acción
        {
          alignment: 'center',
          width: 220,
          image: getSteepFive()
        },
        '\n',
        {
          style: 'tabla',
          table: {
            heights: ['*', 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30],
            body: this.generateTableApdt(ishikawa)
          }
        },
        '\n\n\n',
        //Verificación y Seguimiento
        {
          alignment: 'center',
          width: 220,
          image: getSteepSix()
        },
        '\n',
        {
          alignment: 'center',
          columns: [
            {
              text: 'Colocar el enunciado del problema',
              style: 'fuenteTabla2'
            },
            {
              text: 'Describe la causa raíz',
              style: 'fuenteTabla2'
            },
            {
              text: 'Coloca las acciones correctivas',
              style: 'fuenteTabla2'
            },
            {
              text: '¿Fueron efectivas?',
              style: 'fuenteTabla2'
            },
            {
              text: '¿Por qué?',
              style: 'fuenteTabla2'
            }
          ]
        },
        {
          alignment: 'center',
          columns: [
            {
              style: 'tabla',
              table: {
                widths: [140],
                heights: [300],
                body: [
                  [{ text: ishikawa.problema, style: 'textoIshikawa' }]
                ]
              }
            },
            {
              style: 'tabla',
              table: {
                widths: [140],
                heights: [300],
                body: [
                  [{ text: ishikawa.causa_raiz, style: 'textoIshikawa' }]
                ]
              }
            },
            {
              style: 'tabla',
              table: {
                widths: [140],
                heights: [45, 45, 45, 45, 45, 50],
                body: this.getAccionesCorrectivas(ishikawa.listIdeas)
              }
            },
            {
              style: 'tabla',
              table: {
                widths: [140],
                heights: [45, 45, 45, 45, 45, 50],
                body: this.getEfectividad(ishikawa.listIdeas)
              }
            },
            {
              style: 'tabla',
              table: {
                widths: [140],
                heights: [45, 45, 45, 45, 45, 50],
                body: this.getPorqueAcciones(ishikawa.listIdeas)
              }
            }
          ]
        },
        {
          alignment: 'center',
          columns: [
            {
              style: 'tabla',
              table: {
                widths: [210, 20],
                body: [
                  [{ rowSpan: 2, text: '¿Se solucionó el problema?', style: 'fuentePregunta' },
                  { text: 'SÍ ' + ((ishikawa.solucionado == 1) ? 'X' : ''), style: 'textoIshikawa' }],
                  [{ text: '', style: 'fuentePregunta' }, { text: 'NO ' + ((ishikawa.solucionado == 0) ? 'X' : ''), style: 'textoIshikawa' }]
                ]
              }
            },
            {
              style: 'tabla',
              table: {
                widths: [210, 20],
                body: [
                  [{ rowSpan: 2, text: '¿Ha sido recurrente el problema?', style: 'fuentePregunta' },
                  { text: 'SÍ ' + ((ishikawa.recurrente == 1) ? 'X' : ''), style: 'textoIshikawa' }],
                  [{ text: '', style: 'fuentePregunta' }, { text: 'NO ' + ((ishikawa.recurrente == 0) ? 'X' : ''), style: 'textoIshikawa' }]
                ]
              }
            },
            {
              style: 'tabla',
              table: {
                widths: [210, 20],
                body: [
                  [{ rowSpan: 2, text: '¿Es necesario un analisis mas profundo?', style: 'fuentePregunta' },
                  { text: 'SÍ ' + ((ishikawa.analisis == 1) ? 'X' : ''), style: 'textoIshikawa' }],
                  [{ text: '', style: 'fuentePregunta' }, { text: 'NO ' + ((ishikawa.analisis == 0) ? 'X' : ''), style: 'textoIshikawa' }]
                ]
              }
            }
          ]
        },
        {
          alignment: 'center',
          columns: [
            {
              style: 'tabla',
              table: {
                widths: [240],
                heights: [10, 10],
                body: [
                  [{ text: ishikawa.elaborado, style: 'textoIshikawa' }],
                  [{ text: 'Elaboró', style: 'fuenteFirma' }]
                ]
              }
            },
            {
              style: 'tabla',
              table: {
                widths: [240],
                heights: [10, 10],
                body: [
                  [{ text: ishikawa.revisado, style: 'textoIshikawa' }],
                  [{ text: 'Revisó', style: 'fuenteFirma' }]
                ]
              }
            },
            {
              style: 'tabla',
              table: {
                widths: [240],
                heights: [10, 10],
                body: [
                  [{ text: ishikawa.autorizado, style: 'textoIshikawa' }],
                  [{ text: 'Autorizó(Gerente de Área)', style: 'fuenteFirma' }]
                ]
              }
            }
          ]
        }
      ],
      background: {
        alignment: 'center',
        opacity: 0.1,
        fontSize: 100,
        margin: [0, 100],
        image: getImageBackground()
      },
      pageOrientation: 'landscape',
      styles: {
        header: {
          fontSize: 20,
          bold: true,
          alignment: 'center'
        }
        ,
        fuente: {
          fontSize: 16,
          bold: true,
          alignment: 'center'
        },
        tabla: {
          margin: [0, 5, 0, 15]
        },
        fuenteTabla: {
          fontSize: 14,
          bold: true,
          alignment: 'center',
          color: '#000000',
          fillColor: '#F2F2F2'
        },
        fuenteTabla2: {
          fontSize: 12,
          bold: true,
          alignment: 'center',
          color: '#000000',
          fillColor: '#F2F2F2'
        },
        fuentePregunta: {
          fontSize: 10,
          bold: true,
          alignment: 'center',
          color: '#000000'
        },
        fuenteFirma: {
          fontSize: 10,
          bold: true,
          alignment: 'center',
          color: '#000000',
          fillColor: '#F2F2F2'
        },
        textoTabla: {
          fontSize: 12,
          alignment: 'center'
        },
        textoIshikawa: {
          fontSize: 8,
          alignment: 'center'
        }
      }
    }
    this.imageForPdf = false;
    pdfMake.createPdf(dd).open();
  }

  generateTableApdt(ishikawa: PetIshikawa): Array<any> {
    let tabla = [];
    let header = [];
    let pet_ideas_selected: Array<PetIdeas> = [];

    this.emes.forEach((eme) => {
      let ideas_eme = ishikawa.listIdeas.filter(el => el.id_eme == eme.id && el.porques != undefined);
      if (ideas_eme.length > 0) {
        Array.prototype.push.apply(pet_ideas_selected, ideas_eme);
      }
    });

    header.push(
      { text: 'Enunciado del Problema', style: 'fuenteTabla2' },
      { text: 'Causa Primaria', style: 'fuenteTabla2' },
      { text: 'Causa Secundaria', style: 'fuenteTabla2' },
      { text: 'Causa terciaria', style: 'fuenteTabla2' },
      { text: 'Causa Cuaternaria', style: 'fuenteTabla2' },
      { text: 'Causa quinaria', style: 'fuenteTabla2' },
      { text: 'Causa sextenaria', style: 'fuenteTabla2' },
      { text: 'Causa septenaria', style: 'fuenteTabla2' },
      { text: 'Acción Correctiva', style: 'fuenteTabla2' },
      { text: 'Responsable', style: 'fuenteTabla2' },
      { text: 'Fecha', style: 'fuenteTabla2' });

    tabla.push(header);

    pet_ideas_selected.forEach((idea, index) => {

      if (index < 10) {

        let renglon = [];

        if (index == 0) {
          renglon.push({ rowSpan: 10, text: ishikawa.problema, style: 'textoIshikawa' });
        } else {
          renglon.push({ text: ishikawa.problema, style: 'textoIshikawa' });
        }
        let eme_description = (idea.eme) ? idea.eme.valor : '';
        renglon.push({ text: eme_description, style: 'textoIshikawa' });
        renglon.push({ text: idea.idea, style: 'textoIshikawa' });
        renglon.push({ text: idea.porques.porque_uno, style: 'textoIshikawa' });
        renglon.push({ text: idea.porques.porque_dos, style: 'textoIshikawa' });
        renglon.push({ text: idea.porques.porque_tres, style: 'textoIshikawa' });
        renglon.push({ text: idea.porques.porque_cuatro, style: 'textoIshikawa' });
        renglon.push({ text: idea.porques.porque_cinco, style: 'textoIshikawa' });
        renglon.push({ text: idea.porques.planAccion.accion, style: 'textoIshikawa' });
        renglon.push({ text: idea.porques.planAccion.responsable, style: 'textoIshikawa' });
        renglon.push({ text: idea.porques.planAccion.fecha, style: 'textoIshikawa' });

        tabla.push(renglon);
      }

    });

    let renglon = [{ text: "", style: "textoIshikawa" },
    { text: "", style: "textoIshikawa" },
    { text: "", style: "textoIshikawa" },
    { text: "", style: "textoIshikawa" },
    { text: "", style: "textoIshikawa" },
    { text: "", style: "textoIshikawa" },
    { text: "", style: "textoIshikawa" },
    { text: "", style: "textoIshikawa" },
    { text: "", style: "textoIshikawa" },
    { text: "", style: "textoIshikawa" },
    { text: "", style: "textoIshikawa" }];

    for (let i = pet_ideas_selected.length; i < 10; i++) {
      tabla.push(renglon);
    }
    return tabla
  }

  getAccionesCorrectivas(lista_ideas: Array<PetIdeas>): Array<any> {
    let acciones: Array<PetPlanAccion> = lista_ideas.filter(el => el.porques != undefined).map(el => el.porques.planAccion);
    let tabla = [];
    acciones.forEach((accion, index) => {
      if (index < 6) {
        let renglon = [
          { text: accion.accion, style: "textoIshikawa" }
        ]
        tabla.push(renglon);
      }
    });

    let renglon = [{ text: '', style: "textoIshikawa" }];

    for (let i = acciones.length; i < 6; i++) {
      tabla.push(renglon);
    }

    return tabla;
  }

  getEfectividad(lista_ideas: Array<PetIdeas>): Array<any> {
    let acciones: Array<PetPlanAccion> = lista_ideas.filter(el => el.porques != undefined).map(el => el.porques.planAccion);
    let tabla = [];
    acciones.forEach((accion, index) => {
      if (index < 6) {
        let res = (accion.efectiva == 1) ? "SI" : "NO";
        let renglon = [
          { text: res, style: "textoIshikawa" }
        ]
        tabla.push(renglon);
      }
    });

    let renglon = [{ text: '', style: "textoIshikawa" }];

    for (let i = acciones.length; i < 6; i++) {
      tabla.push(renglon);
    }

    return tabla;
  }


  getPorqueAcciones(lista_ideas: Array<PetIdeas>): Array<any> {
    let acciones: Array<PetPlanAccion> = lista_ideas.filter(el => el.porques != undefined).map(el => el.porques.planAccion);
    let tabla = [];
    acciones.forEach((accion, index) => {
      if (index < 6) {
        let renglon = [
          { text: accion.porque, style: "textoIshikawa" }
        ]
        tabla.push(renglon);
      }
    });

    let renglon = [{ text: '', style: "textoIshikawa" }];

    for (let i = acciones.length; i < 6; i++) {
      tabla.push(renglon);
    }

    return tabla;
  }

  getDiagramaBase64():string {
    let canvas = <HTMLCanvasElement>document.getElementById('image');
    let ctx = canvas.getContext('2d');
    let dataURL = "";
    let img = new Image();

    img.onload = () => {
      canvas.width = img.naturalWidth
      canvas.height = img.naturalHeight
      ctx.drawImage(img, 0, 0);
      ctx.font = "12px Arial";
      dataURL = canvas.toDataURL();

      console.log('url image', dataURL)

    }

    img.src = this.image_src;
    return dataURL;
  }


}
