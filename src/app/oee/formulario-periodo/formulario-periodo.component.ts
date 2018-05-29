import { Component, OnInit, Input } from '@angular/core';
import { Periodo } from '../../models/periodo';
import { Linea } from '../../models/linea';
import { FormularioPeriodoService } from './formulario-periodo.service';
import {
  trigger,
  state,
  style,
  animate,
  transition
} from '@angular/animations';
import { AuthService } from '../../auth/auth.service';
import swal from 'sweetalert2';
import { isNumeroAsignacionValid, findRol } from '../../utils';


declare var $: any;
declare var Materialize: any;
@Component({
  selector: 'app-formulario-periodo',
  templateUrl: './formulario-periodo.component.html',
  providers: [FormularioPeriodoService],
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
export class FormularioPeriodoComponent implements OnInit {

  @Input() periodo: Periodo;
  @Input() seccion: string = "add";

  public loading: boolean;
  public status: string;
  public datos_tabla: boolean;
  public mensajeModal: string;
  public lineas: Array<Linea> = [];
  public periodoTexto: string;
  public infoPeriodo: any;
  public metasEsperadas: Array<any>;
  public disabledBtn: boolean;
  public addMore: boolean;
  public disabledInput: boolean;
  public periodosRegistrados: Array<Periodo>;
  public estatusPeriodo: boolean;

  public permission: any = {
    crear: false,
    editar: false,
    consultar: false
  }

  constructor(private auth: AuthService,
    private service: FormularioPeriodoService) { }

  ngOnInit() {

    this.permission.crear = findRol(23, this.auth.getRolesOee());
    this.permission.editar = findRol(26, this.auth.getRolesOee());
    this.permission.consultar = findRol(25, this.auth.getRolesOee());

    if (this.seccion == "add") {
      this.initComponent();
    } else if (this.seccion == "edit") {
      this.initComponentUpdate(this.periodo);
    }
  }

  initComponent(): void {
    this.loading = true;
    this.datos_tabla = false;
    this.periodoTexto = "";
    this.status = "inactive";
    this.infoPeriodo = {};
    this.metasEsperadas = [];
    this.disabledBtn = false;
    this.addMore = false;
    this.disabledInput = false;
    this.estatusPeriodo = true;

    this.service.getInit(this.auth.getIdUsuario()).subscribe(result => {
      if (result.response.sucessfull) {
        this.lineas = result.data.listLineas || [];
        this.lineas = this.lineas.filter(el => el.id_linea != 6).map(el => el);
        this.infoPeriodo = result.data.periodo || {};
        this.periodoTexto = (result.data.periodo.descripcion_mes + "  " + result.data.periodo.anio) || "";
        this.disabledBtn = false;
        this.datos_tabla = true;
        this.loading = false;
        setTimeout(() => { this.ngAfterViewInitHttp() }, 200)
      } else {
        Materialize.toast('Ocurrió  un error al cargar formulario!', 4000, 'red');
        this.loading = false;
      }
    }, error => {
      Materialize.toast('Ocurrió  un error en el servicio!', 4000, 'red');
      this.loading = false;
    });
  }

  initComponentUpdate(periodo: Periodo): void {
    this.loading = true;
    this.datos_tabla = false;
    this.periodoTexto = "";
    this.status = "inactive";
    this.metasEsperadas = [];
    this.disabledBtn = true;
    this.disabledInput = !this.permission.editar;
    this.periodosRegistrados = [];
    this.estatusPeriodo = true;


    this.service.getDetailsByPeriodo(this.auth.getIdUsuario(), periodo.id_periodo).subscribe(result => {
   
      if (result.response.sucessfull) {
        this.estatusPeriodo = result.data.estatusPeriodo;

        if(!this.estatusPeriodo){
          this.disabledInput = true;
        }
  
        this.periodosRegistrados = result.data.listDetailsPeriodo || [];
        this.periodoTexto = periodo.descripcion_mes + " " + periodo.anio;
        this.disabledBtn = false;
        this.datos_tabla = true;
        this.loading = false;
        setTimeout(() => { this.ngAfterViewInitHttp() }, 200)
      } else {
        Materialize.toast('Ocurrió  un error al cargar formulario!', 4000, 'red');
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
    this.status = "active";
    $('.tooltipped').tooltip({ delay: 50 });
  }

  agregar() {
    $('.tooltipped').tooltip('hide');
  }

  regresar() {
    $('.tooltipped').tooltip('hide');
  }

  openModalConfirmacion(accion: string, event?: any): void {
    $('.tooltipped').tooltip('hide');
    if (this.validaDatos('.datos')) {

      this.disabledBtn = true;
      this.mensajeModal = '';

      if (this.seccion == 'edit') {
        this.periodosRegistrados.forEach((el) => {
          el.disponibilidad = parseFloat("" + el.disponibilidad);
          el.utilizacion = parseFloat("" + el.utilizacion);
          el.oee = parseFloat("" + el.oee);
          el.calidad = parseFloat("" + el.calidad);
          el.eficiencia_teorica = parseFloat("" + el.eficiencia_teorica);
        });
      }

      switch (accion) {
        case 'abrir':
          this.mensajeModal = '¿ Está seguro de hacer la apertura del periodo ? ';
          break;
        case 'actualizar':
          this.mensajeModal = '¿ Está seguro de actualizar la información del periodo ? ';
          break;
      }

      /* 
       * Configuración del modal de confirmación
       */
      swal({
        title: '<span style="color: #303f9f ">' + this.mensajeModal + '</span>',
        type: 'question',
        html: '<p style="color: #303f9f "> Periodo : <b>' + this.periodoTexto + '</b>',
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
            case 'abrir':
              this.service.abrir(this.auth.getIdUsuario(), this.metasEsperadas, this.infoPeriodo).subscribe(result => {
                if (result.response.sucessfull) {
                  this.disabledInput = true;
                  this.addMore = true;
                  Materialize.toast(' Apertura de periodo correcta ', 4000, 'green');
                } else {
                  this.disabledBtn = false;
                  Materialize.toast(result.response.message, 4000, 'red');
                }
              }, error => {
                this.disabledBtn = false;
                Materialize.toast('Ocurrió  un error en el servicio!', 4000, 'red');
              });
              break;
            case 'actualizar':
              this.service.update(this.auth.getIdUsuario(), this.periodosRegistrados).subscribe(result => {
                if (result.response.sucessfull) {
                  this.disabledBtn = false;
                  Materialize.toast(' Actualización de periodo correcta ', 4000, 'green');
                } else {
                  this.disabledBtn = false;
                  Materialize.toast(result.response.message, 4000, 'red');
                }
              }, error => {
                this.disabledBtn = false;
                Materialize.toast('Ocurrió  un error en el servicio!', 4000, 'red');
              });
              break;
          }
          /*
          * Si cancela accion
          */
        } else if (result.dismiss === swal.DismissReason.cancel) {
          this.disabledBtn = false;
        }
      })
    } else {
      Materialize.toast('Verifique los datos en las casillas rojas!', 5000, 'red');
    }

  }

  validaDatos(clase: string): boolean {
    let bandera = true;
    let tmp = this.seccion;
    let metas = [];
    this.metasEsperadas = [];

    $(clase + ' tr').each(function (index) {

      let objTmp = {
        id_linea: -1, disponibilidad: 0, utilizacion: 0, calidad: 0, oee: 0, eficiencia_teorica: 0
      };
      objTmp.id_linea = parseInt($(this).attr('id'));

      $(this).find('input').each(function (index2) {
        let caja = $(this);

        if (!isNumeroAsignacionValid(caja.val())) {
          bandera = false;
          caja.css('background-color', '#ffcdd2');
        } else {
          caja.css('background-color', '');

          if (tmp == 'add') {

            switch (index2) {
              case 0:
                objTmp.disponibilidad = parseFloat(caja.val());
                break;
              case 1:
                objTmp.utilizacion = parseFloat(caja.val());
                break;
              case 2:
                objTmp.calidad = parseFloat(caja.val());
                break;
              case 3:
                objTmp.oee = parseFloat(caja.val());
                break;
              case 4:
                objTmp.eficiencia_teorica = parseFloat(caja.val());
                break;
            }

          }
        }
      });
      if (tmp == 'add') {
        metas.push(objTmp);
      }

    });

    if (tmp == 'add') {
      this.metasEsperadas = metas;
    }
    return bandera;
  }

  agregarOtro(): void {
    this.initComponent();
  }

}
