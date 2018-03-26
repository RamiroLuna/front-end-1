import { Component, OnInit, AfterViewInit } from '@angular/core';
import { AsginacionMetasService } from './asginacion-metas.service';
import { AuthService } from '../../auth/auth.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Catalogo } from '../../models/catalogo';
import { Meta } from '../../models/meta';
import { MetaAsignacion } from '../../models/meta-asignacion';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { isValidId } from '../../utils';
import swal from 'sweetalert2';



declare var $: any;
declare var Materialize: any;

@Component({
  selector: 'app-asginacion-metas',
  templateUrl: './asginacion-metas.component.html',
  providers: [AsginacionMetasService]
})
export class AsginacionMetasComponent implements AfterViewInit {



  /*
   * Listas requeridas para el formulario de metas
   */
  public turnos: Array<Catalogo>;
  public lineas: Array<Catalogo>;
  public grupos: Array<Catalogo>;
  public metas: Array<Meta>;
  /*
   * Fin
   */

  public loading: boolean;
  public formAsignacion: FormGroup;
  public submitted: boolean;
  public mensajeModal: string;
  public texto_btn: string;
  public asignacion: MetaAsignacion;


  /*
   * Esta variable controla la seccion
   */
  public seccion: string;
  public id: any; //Id seleccionado

  constructor(private service: AsginacionMetasService,
    private auth: AuthService,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router
  ) { }


  ngOnInit() {
    this.loading = true;
    this.submitted = false;
    this.texto_btn = "Cancelar";

    this.route.paramMap.subscribe(params => {
      if (params.get('id') == 'nuevo') {
        this.seccion = 'add';
      } else if (isValidId(params.get('id'))) {
        this.seccion = 'edit';
        this.id = params.get('id');
      } else {
        this.seccion = 'invalid';
      }
    });

    /*
 * Incia consulta
 */
    if (this.seccion != 'invalid') {

      if (this.seccion == 'edit') {
        this.service.getAsignacionById(this.auth.getIdUsuario(), this.id).subscribe(result => {
          
          if (result.response.sucessfull) {
            this.asignacion = result.data.metasAsignacion;
            /*
             * Catalogos para mostrar en el formulario de edicio
             */ 
            this.turnos = [{id: this.asignacion.id_turno , descripcion: this.asignacion.turno, activo:-1}];
            this.grupos = [{id: this.asignacion.id_grupo , descripcion: this.asignacion.turno, activo:-1}];
            this.metas = [{id_meta: this.asignacion.id_meta,
                          id_linea: -1,
                          linea: 'default',
                          meta: this.asignacion.meta,
                          tipo_medida:'default',
                          posicion:-1,
                          activo:-1 }];
             /*
              * Fin catalogos de edicion
              */ 
            this.loading= false;
            this.loadFormulario();

          } else {
            Materialize.toast(result.response.message, 4000, 'red');
            this.loading= false;
          }
        }, error => {
          Materialize.toast('Ocurrió un error en el servicio!', 4000, 'red');
          this.loading= false;
        });

      

      } else if (this.seccion == 'add') {
        /*
        * Consulta el elemento del catalogo
        */
        this.service.getCatalogos(this.auth.getIdUsuario()).subscribe(result => {
          if (result.response.sucessfull) {
            this.turnos = result.data.listTurnos;
            this.grupos = result.data.listGrupos;
            this.lineas = result.data.listLineas;
            this.metas = result.data.listMetas;
          } else {
            Materialize.toast(result.response.message, 4000, 'red');
          }
        }, error => {
          Materialize.toast('Ocurrió un error en el servicio!', 4000, 'red');
        });
        /*
         * Fin carga de catalogos necesarios para el formulario
         */
        this.asignacion = new MetaAsignacion();
        this.loadFormulario();
        this.loading = false;
      }
    } else {
      this.loading = false;
    }

  }

  loadFormulario(): void {
    this.formAsignacion = this.fb.group({
      id_meta: new FormControl({ value: this.asignacion.id_meta, disabled: this.seccion == 'edit' }, [Validators.required]),
      id_turno: new FormControl({ value: this.asignacion.id_turno, disabled: this.seccion == 'edit' }, [Validators.required]),
      id_grupo: new FormControl({ value: this.asignacion.id_grupo, disabled: this.seccion == 'edit' }, [Validators.required]),
      dia: new FormControl({ value: this.asignacion.dia , disabled: this.seccion == 'edit' }, [Validators.required]),
      valor: new FormControl(this.asignacion.valor, [Validators.required, Validators.pattern(/^\d*(\.[0-9]{1,10})*$/)]),
    });
  }

  /* 
   * Carga de plugins para el componente
   */
  ngAfterViewInit(): void {
    $('#dia').pickadate({
      selectMonths: true, // Creates a dropdown to control month
      selectYears: 15, // Creates a dropdown of 15 years to control year,
      today: '',
      clear: 'Limpiar',
      close: 'OK',
      monthsFull: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
      monthsShort: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
      weekdaysShort: ['Dom', 'Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab'],
      weekdaysLetter: ['D', 'L', 'M', 'M', 'J', 'V', 'S'],
      format: 'dd/mm/yyyy',
      closeOnSelect: false, // Close upon selecting a date,
      onClose:  () =>{
          this.asignacion.dia = $('#dia').val();
      }
    });
  }

  openModalConfirmacion(asginacion: MetaAsignacion, accion: string, type: string): void {
    this.asignacion.dia = $('#dia').val();
    this.submitted = true;
    this.mensajeModal = '';

    if (this.formAsignacion.valid) {

      switch (accion) {
        case 'add':
          this.mensajeModal = '¿Está seguro de agregar ? ';
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
        html: '<p style="color: #303f9f "> Asignación para el día : <b> ' + asginacion.dia + ' </b></p>',
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
            this.service.agregar(this.auth.getIdUsuario(), asginacion).subscribe(result => { 
              console.log('result', result)             
              if (result.response.sucessfull) {
                Materialize.toast('Se agregó correctamente', 4000, 'green');
                this.router.navigate(['../../metas-asignaciones'], { relativeTo: this.route });

              } else {
                Materialize.toast(result.response.message, 4000, 'red');
              }
            }, eror => {
              Materialize.toast('Ocurrió un error en el servicio!', 4000, 'red');
            });
          } else if (this.seccion == 'edit') {
             this.service.update(this.auth.getIdUsuario(), asginacion).subscribe(
              result => {
                console.log('aada->',result)
                if (result.response.sucessfull) {
                  Materialize.toast('Actualización completa', 4000, 'green');
                  this.texto_btn = 'Cerrar ficha';
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
      Materialize.toast('Se encontrarón errores!', 4000, 'red');
    }

  }

}
