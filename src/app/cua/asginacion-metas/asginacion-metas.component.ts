import { Component,  OnInit, AfterViewInit } from '@angular/core';
import { AsginacionMetasService } from './asginacion-metas.service';
import { AuthService } from '../../auth/auth.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Catalogo } from '../../models/catalogo';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { isValidId } from '../../utils';
import swal from 'sweetalert2';
import { Meta } from '../../models/meta';
import { Asignacion } from '../../models/asignacion';

declare var $: any;
declare var Materialize: any;

@Component({
  selector: 'app-asginacion-metas',
  templateUrl: './asginacion-metas.component.html',
  providers: [AsginacionMetasService]
})
export class AsginacionMetasComponent implements AfterViewInit{



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

    public loading:boolean;
    public formAsignacion: FormGroup;
    public submitted: boolean;
    public mensajeModal: string;
    public texto_btn: string;
    

    /*
     * Esta variable controla la seccion
     */ 
    public seccion: string;
    public id:any; //Id seleccionado

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
      /*
       * Consulta el elemento del catalogo
       */
      this.service.getCatalogos(this.auth.getIdUsuario()).subscribe(result => {
        console.log('carga atalogos asigna', result)
        if (result.response.sucessfull) {
          this.turnos = result.data.listTurnos;
          this.grupos = result.data.listGrupos;
          this.lineas = result.data.listLineas;
          this.metas = result.data.listMetas;
          this.loading= false;
        } else {
          Materialize.toast(result.response.message, 4000, 'red');
          this.loading= false;
        }
      }, error => {
        Materialize.toast('Ocurrió un error en el servicio!', 4000, 'red');
        this.loading= false;
      });

      // if(this.seccion == 'edit'){
      //   this.service.getMeta(this.auth.getIdUsuario(), this.id).subscribe(result => {
      //     if (result.response.sucessfull) {
      //       this.meta = result.data.metasDTO;
      //       this.loading= false;
      //     } else {
      //       Materialize.toast(result.response.message, 4000, 'red');
      //       this.loading= false;
      //     }
      //   }, error => {
      //     Materialize.toast('Ocurrió un error en el servicio!', 4000, 'red');
      //     this.loading= false;
      //   });
      // }else if (this.seccion == 'add'){
      //    this.meta = new Meta();
      //    this.loading = false;
      // }

      this.loadFormulario();

    } else {
      this.loading = false;
    }

  }

  loadFormulario(): void {
    this.formAsignacion = this.fb.group({
      // id_linea: new FormControl(this.meta.id_linea, [Validators.required]),
      // meta: new FormControl(this.meta.meta, [Validators.required]),
      // medida: new FormControl(this.meta.tipo_medida, [Validators.required]),
    });
  }
  
  /* 
   * Carga de plugins para el componente
   */ 
  ngAfterViewInit(): void {
    $('.datepicker').pickadate({
      selectMonths: true, // Creates a dropdown to control month
      selectYears: 15, // Creates a dropdown of 15 years to control year,
      today: 'Hoy',
      clear: 'Limpiar',
      close: 'Ok',
      monthsFull: [ 'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre' ],
      monthsShort: [ 'Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic' ],
      weekdaysShort: [ 'Dom', 'Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab' ],
      weekdaysLetter: [ 'D', 'L', 'M', 'M', 'J', 'V', 'S' ],
      format: 'dd/mm/yyyy',
      closeOnSelect: false // Close upon selecting a date,
    });
  }

  openModalConfirmacion(asginacion: Asignacion, accion: string, type: string): void {

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
        html: '<p style="color: #303f9f "> Elemento : <b> </b></p>',
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
            /*this.service.agregar(this.auth.getIdUsuario(), meta).subscribe(result => {
              if (result.response.sucessfull) {
                Materialize.toast('Se agregó correctamente', 4000, 'green');
                this.router.navigate(['../../metas']);
              } else {
                Materialize.toast(result.response.message, 4000, 'red');
              }
            }, eror => {
              Materialize.toast('Ocurrió un error en el servicio!', 4000, 'red');
            });*/
          } else if (this.seccion == 'edit') {
           /* this.service.update(this.auth.getIdUsuario(), meta).subscribe(
              result => {
                if (result.response.sucessfull) {
                  Materialize.toast('Actualización completa', 4000, 'green');
                  this.texto_btn = 'Cerrar ficha';
                } else {
                  Materialize.toast(result.response.message, 4000, 'red');
                }
              }, error => {
                Materialize.toast('Ocurrió un error en el servicio!', 4000, 'red');
              });*/
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
