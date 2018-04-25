import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { ListaFallasService } from './lista-fallas.service';
import swal from 'sweetalert2';
import { DataTable , deleteItemArray} from '../../utils';
import { Falla } from '../../models/falla';
import { Linea } from '../../models/linea';
import { Catalogo } from '../../models/catalogo';
import { AuthService } from '../../auth/auth.service';
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
  selector: 'app-lista-fallas',
  templateUrl: './lista-fallas.component.html',
  providers: [ListaFallasService],
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
export class ListaFallasComponent implements OnInit {

  public loading: boolean;
  public submitted: boolean;
  public bVistaPre: boolean;
  public formBusqueda: FormGroup;
  public paramsBusqueda: any;
  public status: string;
  public mensajeModal:string;


  public fallas: Array<Falla> = [];
  /* Catalogos requeridos */
  public lineas: Array<Linea>;
  public grupos: Array<Catalogo>;
  public turnos: Array<Catalogo>;

  constructor(
    private service: ListaFallasService,
    private auth: AuthService,
    private fb: FormBuilder, ) { }

  ngOnInit() {

    this.loading = true;
    this.submitted = false;
    this.bVistaPre = false;
    this.status = "inactive";
    this.paramsBusqueda = {};

    this.service.getCatalogos(this.auth.getIdUsuario()).subscribe(result => {

      if (result.response.sucessfull) {
        this.lineas = result.data.listLineas || [];
        this.grupos = result.data.listGrupos || [];
        this.turnos = result.data.listTurnos || [];


        this.loading = false;
        this.loadFormulario();

        setTimeout(() => { this.ngAfterViewHttp(); }, 200)
      } else {


        this.loading = false;
        Materialize.toast(result.response.message, 4000, 'red');
      }
    }, error => {


      this.loading = false;
      Materialize.toast('Ocurrió un error en el servicio!', 4000, 'red');
    });


  }

  loadFormulario(): void {
    this.formBusqueda = this.fb.group({
      inicio: new FormControl({ value: this.paramsBusqueda.inicio, disabled: false }, [Validators.required]),
      fin: new FormControl({ value: this.paramsBusqueda.fin, disabled: false }, [Validators.required]),
      id_linea: new FormControl({ value: this.paramsBusqueda.id_linea, disabled: false }, [Validators.required]),
      id_grupo: new FormControl({ value: this.paramsBusqueda.id_grupo, disabled: false }, [Validators.required]),
      id_turno: new FormControl({ value: this.paramsBusqueda.id_turno, disabled: false }, [Validators.required])
    });

  }

  /*
 * Carga plugins despues de cargar y mostrar objetos en el DOM
 */
  ngAfterViewHttp(): void {

    // DataTable('#tabla');
    $('.tooltipped').tooltip({ delay: 50 });

    $('.inicio, .fin').pickadate({
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
      onClose: () => {
        this.paramsBusqueda.inicio = $('.inicio').val();
        this.paramsBusqueda.fin = $('.fin').val();
      }
    });

  }

  agregar() {
    $('.tooltipped').tooltip('hide');
  }

  regresar() {
    $('.tooltipped').tooltip('hide');
  }

  changeCombo():void{
  
    this.bVistaPre = false;
    this.status = 'inactive';
  }

  busqueda(parametrosBusqueda: any) {
    this.status = 'inactive';
    this.submitted = true;

    if (this.formBusqueda.valid) {
      this.service.getAllFallasByDays(this.auth.getIdUsuario(), parametrosBusqueda).subscribe(result => {
      
        if (result.response.sucessfull) {
          this.fallas = result.data.listFallas || [];
          this.bVistaPre = true;

          setTimeout(() => { 
            this.status = 'active';
            if(this.fallas.length > 0){
              DataTable('#tabla');
            }
          }, 400)

        } else {
          this.status = 'inactive';
          this.bVistaPre = false;
          Materialize.toast(result.response.message, 4000, 'red');
        }
      }, error => {
        this.status = 'inactive';
        this.bVistaPre = false;
        Materialize.toast('Ocurrió un error en el servicio!', 4000, 'red');
      });
    } else {
      this.status = 'inactive';
      Materialize.toast('Ingrese todos los datos para mostrar fallas!', 4000, 'red');
    }
  }

  openModalConfirmacion(falla: Falla, accion: string, event?: any): void {
    this.mensajeModal = '';

    switch (accion) {
      case 'activar':
        break;
      case 'eliminar':
        this.mensajeModal = '¿Está seguro de eliminar falla? ';
        break;
    }


    /* 
     * Configuración del modal de confirmación
     */
    swal({
      title: '<span style="color: #303f9f ">' + this.mensajeModal + '</span>',
      type: 'question',
      html: '<p style="color: #303f9f "><b> Día: </b>' + falla.dia + '<b> Tiempo total de paro: </b>' + falla.tiempo_paro + '</p>',
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
          case 'activar':
            break;
          case 'eliminar':
            this.service.delete(this.auth.getIdUsuario(), falla.id_falla).subscribe(result => {
              if (result.response.sucessfull) {
                deleteItemArray(this.fallas,  falla.id_falla, 'id_falla');
                $('#tabla').DataTable().row('.'+falla.id_falla).remove().draw( false );
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


}
