import { Component, OnInit, Input, OnChanges, SimpleChanges, SimpleChange, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { FormularioFallasService } from './formulario-fallas.service';
import { AuthService } from '../../auth/auth.service';
import { isValidId, getMilisegundosHoras, getTodayMilisegundos, hmToMs } from '../../utils';
import { Falla } from '../../models/falla';
import { Catalogo } from '../../models/catalogo';
import swal from 'sweetalert2';
import { Linea } from '../../models/linea';
import { RazonParo } from '../../models/razon-paro';
import { Equipo } from '../../models/equipo';


declare var $: any;
declare var Materialize: any;
@Component({
  selector: 'app-formulario-fallas',
  templateUrl: './formulario-fallas.component.html',
  providers: [FormularioFallasService]
})
export class FormularioFallasComponent implements OnInit, OnChanges {
  public loading: boolean;
  public seccion: string;
  public submitted: boolean;
  public mensajeModal: string;
  public textoBtn: string;
  public textoFormulario: string;
  public falla: Falla;
  public formFalla: FormGroup;
  /* Catalogos requeridos */
  public lineas: Array<Linea>;
  public grupos: Array<Catalogo>;
  public turnos: Array<Catalogo>;
  public fuentes: Array<Catalogo>;
  public razones: Array<RazonParo> = [];
  public todasRazones: Array<RazonParo> = [];
  public equipos: Array<Equipo>;

  /* Se recibe id en caso de editar */
  @Input() id: number;
  @Output() failUpdate = new EventEmitter();

  constructor(
    private service: FormularioFallasService,
    private auth: AuthService,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router) { }

  ngOnInit() {

    this.loading = true;
    this.submitted = false;
    this.textoBtn = "";
    this.textoFormulario = "";
    this.falla = new Falla();


    this.route.paramMap.subscribe(params => {
      if (params.get('id') == 'nuevo') {
        this.textoFormulario = "Capture datos para registrar la falla del turno:";
        this.seccion = 'add';
        this.textoBtn = 'AGREGAR';
      } else if (isValidId(this.id)) {
        this.textoFormulario = "Actualizar datos de falla:";
        this.seccion = 'edit';
        this.textoBtn = 'EDITAR';
      } else {
        this.seccion = 'invalid';
      }
    });

    /*
   * Incia consulta
   */
    if (this.seccion != 'invalid') {

      if (this.seccion == 'edit') {
        this.service.getFalla(this.auth.getIdUsuario(), this.id).subscribe(result => {

          if (result.response.sucessfull) {
            this.lineas = result.data.listLineas || [];
            this.grupos = result.data.listGrupos || [];
            this.turnos = result.data.listTurnos || [];
            this.todasRazones = result.data.listRazonesParo || [];
            this.fuentes = result.data.listFuentesParo || [];
            this.equipos = result.data.listEquipos || [];
            this.falla = result.data.fallasDTO || new Falla();
            this.loading = false;
            this.loadFormulario();
            setTimeout(() => this.ngAfterViewHttp(), 20);

          } else {
            this.seccion = "error";
            Materialize.toast(result.response.message, 4000, 'red');
            this.loading = false;
          }
        }, error => {
          this.seccion = "error";
          Materialize.toast('Ocurrió un error en el servicio!', 4000, 'red');
          this.loading = false;
        });
      } else if (this.seccion == 'add') {

        this.service.getCatalogos(this.auth.getIdUsuario()).subscribe(result => {

          if (result.response.sucessfull) {
            this.lineas = result.data.listLineas || [];
            this.grupos = result.data.listGrupos || [];
            this.turnos = result.data.listTurnos || [];
            this.todasRazones = result.data.listRazonesParo || [];
            this.fuentes = result.data.listFuentesParo || [];
            this.equipos = result.data.listEquipos || [];
            this.falla.diaString = result.data.metasDTO.dia_string || "";
            this.falla.id_turno = result.data.metasDTO.id_turno;
            this.falla.id_grupo = result.data.metasDTO.id_grupo;
            this.falla.id_linea = result.data.metasDTO.id_linea;
            this.falla.id_meta = result.data.metasDTO.id_meta || -1;

            this.seccion = "add";
            this.loading = false;
            this.loadFormulario();
            setTimeout(() => this.ngAfterViewHttp(), 20);
          } else {
            this.seccion = "error";
            this.loading = false;
            Materialize.toast(result.response.message, 4000, 'red');
          }
        }, error => {

          this.seccion = "error";
          this.loading = false;
          Materialize.toast('Ocurrió un error en el servicio!', 4000, 'red');
        });

      }

    } else {
      this.loading = false;
    }
  }

  loadFormulario(): void {
    this.formFalla = this.fb.group({
      diaString: new FormControl({ value: this.falla.diaString, disabled: true }, [Validators.required]),
      id_linea: new FormControl({ value: this.falla.id_linea, disabled: true }, [Validators.required]),
      id_grupo: new FormControl({ value: this.falla.id_grupo, disabled: true }, [Validators.required]),
      id_turno: new FormControl({ value: this.falla.id_grupo, disabled: true }, [Validators.required]),
      id_fuente: new FormControl(this.falla.id_fuente, [Validators.required]),
      id_razon: new FormControl(this.falla.id_razon, [Validators.required]),
      id_equipo: new FormControl(this.falla.id_equipo, [Validators.required]),
      descripcion_equipo: new FormControl({ value: this.falla.descripcion_equipo, disabled: true }),
      hora_inicio: new FormControl(this.falla.hora_inicio, [Validators.required, Validators.pattern('^([0-9]|0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]')]),
      hora_final: new FormControl(this.falla.hora_final, [Validators.required, Validators.pattern('^([0-9]|0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]')]),
      tiempo_paro: new FormControl({ vallue: this.falla.tiempo_paro, disabled: true }, [Validators.required]),
      descripcion: new FormControl(this.falla.descripcion, [Validators.required]),
    });

  }

  /*
   * Carga plugins despues de cargar y mostrar objetos en el DOM
   */
  ngAfterViewHttp(): void {

    $('textarea#problema').characterCounter();
    $('.tooltipped').tooltip({ delay: 50 });
  }

  cambioHora(): void {
    let regex = /^([0-9]|0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/;
    if (regex.test(this.falla.hora_inicio) && regex.test(this.falla.hora_final)) {
      let milisegundos_inicio = getMilisegundosHoras(this.falla.diaString, this.falla.hora_inicio);
      let milisegundos_fin = getMilisegundosHoras(this.falla.diaString, this.falla.hora_final);

      if (milisegundos_fin >= milisegundos_inicio) {
        let total = milisegundos_fin - milisegundos_inicio;

        let horas = (((total / 1000) / 60) / 60).toFixed(2);

        this.falla.tiempo_paro = "" + horas;

      } else {
        let ms24 = 24 * 60 * 60 * 1000;
        let msFin = hmToMs(this.falla.hora_final);
        let msInicio = hmToMs(this.falla.hora_inicio);

        let total = (ms24 - msInicio) + msFin;

        let horas = (((total / 1000) / 60) / 60).toFixed(2);
        this.falla.tiempo_paro = "" + horas;


      }

    } else {

      this.falla.tiempo_paro = "0";
    }

  }

  agregar() {
    $('.tooltipped').tooltip('hide');
  }

  regresar() {
    $('.tooltipped').tooltip('hide');
  }


  chnageFuenteParo(idFuenteParo: number): void {
    this.razones = this.todasRazones.filter((el) => el.id_fuente_paro == idFuenteParo);
  }

  changeEquipo(idEquipo: number): void {

    let el = this.equipos.filter((el) => el.id_equipos == idEquipo);

    if (el.length > 0) {
      this.falla.descripcion_equipo = el[0].descripcion;
    } else {
      this.falla.descripcion_equipo = "";
    }

  }

  descriptivoEquipo(idEquipo: number): string {
    let el = this.equipos.filter((el) => el.id_equipos == idEquipo);
    if (el.length > 0) {
      return el[0].descripcion;
    } else {
      return "";
    }
  }

  descriptivoValorRazon(idRazon: number): string {
    let el = this.razones.filter((el) => el.id_razon_paro == idRazon);
    if (el.length > 0) {
      return el[0].valor;
    } else {
      return "";
    }
  }

  descriptivoValorFuente(idFuente: number): string {
    let el = this.fuentes.filter((el) => el.id == idFuente);
    if (el.length > 0) {
      return el[0].valor;
    } else {
      return "";
    }
  }

  descriptivoValorEquipo(idEquipo: number): string {
    let el = this.equipos.filter((el) => el.id_equipos == idEquipo);
    if (el.length > 0) {
      return el[0].valor;
    } else {
      return "";
    }
  }

  openModalConfirmacion(falla: Falla, accion: string, type: string): void {

    this.submitted = true;
    this.mensajeModal = '';


    if (this.formFalla.valid) {

      switch (accion) {
        case 'add':
          this.mensajeModal = '¿ Está seguro de agregar falla ? ';
          break;
        case 'edit':
          this.mensajeModal = '¿ Está seguro de actualizar la información ? ';
          break;
      }
      /* 
       * Configuración del modal de confirmación
       */
      swal({
        title: '<span style="color: #303f9f ">' + this.mensajeModal + '</span>',
        type: 'question',
        html: '<p style="color: #303f9f "> Dia : <b>' + falla.diaString + '</b> <b> Linea</b> : ' + falla.id_linea + '</b></p>',
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

          if (this.seccion == 'add') {
            this.service.agregar(this.auth.getIdUsuario(), falla).subscribe(result => {

              if (result.response.sucessfull) {
                Materialize.toast('Se agregó correctamente', 4000, 'green');
                this.router.navigate(['../../fallas'], { relativeTo: this.route });
              } else {
                Materialize.toast(result.response.message, 4000, 'red');
              }
            }, eror => {
              Materialize.toast('Ocurrió un error en el servicio!', 4000, 'red');
            });
          } else if (this.seccion == 'edit') {
            this.service.update(this.auth.getIdUsuario(), falla).subscribe(
              result => {
                if (result.response.sucessfull) {
                  falla.valor_fuente =  this.descriptivoValorFuente(falla.id_fuente);
                  falla.valor_razon = this.descriptivoValorRazon(falla.id_razon);
                  falla.valor_equipo = this.descriptivoValorEquipo(falla.id_equipo);
                  falla.descripcion_equipo = this.descriptivoEquipo(falla.id_equipo);
                  this.failUpdate.emit({ falla: falla });
                  Materialize.toast('Actualización completa', 4000, 'green');
                } else {
                  Materialize.toast(result.response.message, 4000, 'red');
                }
              }, error => {
                Materialize.toast('Ocurrió un error en el servicio!', 4000, 'red');
              });
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

  ngOnChanges(changes: SimpleChanges) {
    if (this.seccion == 'edit') {
      this.id = changes.id.currentValue;
      this.service.getFalla(this.auth.getIdUsuario(), this.id).subscribe(result => {

        if (result.response.sucessfull) {
          this.lineas = result.data.listLineas || [];
          this.grupos = result.data.listGrupos || [];
          this.turnos = result.data.listTurnos || [];
          this.todasRazones = result.data.listRazonesParo || [];
          this.fuentes = result.data.listFuentesParo || [];
          this.equipos = result.data.listEquipos || [];
          this.falla = result.data.fallasDTO || new Falla();
          this.loading = false;
          this.loadFormulario();
          setTimeout(() => this.ngAfterViewHttp(), 20);

        } else {
          this.seccion = "error";
          Materialize.toast(result.response.message, 4000, 'red');
          this.loading = false;
        }
      }, error => {
        this.seccion = "error";
        Materialize.toast('Ocurrió un error en el servicio!', 4000, 'red');
        this.loading = false;
      });
    }

  }


}
