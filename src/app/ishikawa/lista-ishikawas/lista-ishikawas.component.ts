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
import { PetIdeas } from '../../models/pet-ideas';
import { PetPlanAccion } from '../../models/pet-plan-accion';
import { getDefinitionPdf } from '../utils-for-pdf/doc.definition.pdf';
import { getDiamagraIshikawa } from '../utils-for-pdf/generate.diagram.text';
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
  public imageForPdf: boolean;


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
    this.image_src = 'assets/diagrama_ishikawa_pdf.png';
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
        '<b>Solo podra editar si el ishikawa no ha sido revisado o verificado</b></br>' +
        'Para <b>verficar</b> haga clic en el botón <i class="material-icons">list</i> <br>' +
        '<b> La verificación se habilitará un día después de la fecha más lejana registrada en el plan de acción</b> y si el ishikawa ha sido revisado<br><br>' +
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
   
    this.imageForPdf = true;

    this.getDiagramaBase64(this.image_src, ishikawa).then(
      (successurl) =>{
        //Si ya tiene todos los elementos necesarios para generar el pdf
        let tabla_apdt = this.generateTableApdt(ishikawa);
        let acciones = this.getAccionesCorrectivas(ishikawa.listIdeas);
        let efectividad =  this.getEfectividad(ishikawa.listIdeas);
        let porque_acciones = this.getPorqueAcciones(ishikawa.listIdeas);
        let documento = getDefinitionPdf(ishikawa, successurl,tabla_apdt, acciones, efectividad, porque_acciones);
        pdfMake.createPdf(documento).open();
      },
      (errorurl) =>{
         //Si no genera la base64 del pdf
         Materialize.toast('Ocurrió  un error al crear pdf!', 4000, 'red');
      });

    this.imageForPdf = false;
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

  getDiagramaBase64(url,ishikawa:PetIshikawa) {
    return new Promise(function (resolve, reject) {
      let canvas = <HTMLCanvasElement>document.getElementById('image');
      let ctx = canvas.getContext('2d');
      let dataURL = "";
      var img = new Image()
      img.onload =  () => {
        /*
         * Inicia el pintado del diagrama de ishikawa
         */ 
        canvas.width = img.naturalWidth
        canvas.height = img.naturalHeight
        ctx.drawImage(img, 0, 0);
        ctx.font = "9px Arial";
        getDiamagraIshikawa(ishikawa,ctx, canvas);
        /*
         * Fin generación diagrama
         */ 
        
        dataURL = canvas.toDataURL();
        resolve(dataURL)
      }
      img.onerror =  () =>{
        reject(url)
      }
      img.src = url;
    })

  }


}
