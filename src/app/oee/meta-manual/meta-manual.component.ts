import { Component, OnInit, AfterViewInit } from '@angular/core';
import { MetamanualService } from './metamanual.service';
import { AuthService } from '../../auth/auth.service';
import { Catalogo } from '../../models/catalogo';
import { Linea } from '../../models/linea';
import { Forecast } from '../../models/forecast';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { isValidId } from '../../utils';
import swal from 'sweetalert2';

declare var $: any;
declare var Materialize: any;
@Component({
  selector: 'app-meta-manual',
  templateUrl: './meta-manual.component.html',
  providers: [MetamanualService]
})
export class MetaManualComponent implements OnInit {


  /*
   * Listas requeridas para el formulario de metas
   */
  public turnos: Array<Catalogo>;
  public lineas: Array<Linea>;
  public grupos: Array<Catalogo>;

  /*
   * Fin
   */

  public loading: boolean;
  public formCargaManual: FormGroup;
  public submitted: boolean;
  public mensajeModal: string;
  public texto_btn: string;
  public rowForecast: Forecast;


  /*
   * Esta variable controla la seccion
   */
  public seccion: string;
  public id: any; //Id seleccionado

  constructor(private service: MetamanualService,
    private auth: AuthService,
    private fb: FormBuilder
  ) { }

  ngOnInit() {
    this.seccion = 'add';
    this.loading = true;
    this.submitted = false;
    this.texto_btn = "Cancelar";
    this.rowForecast = new Forecast();

    /*
        * Consulta el elemento del catalogo
        */
    this.service.getCatalogos(this.auth.getIdUsuario()).subscribe(result => {
     
      if (result.response.sucessfull) {
        this.turnos = result.data.listTurnos;
        this.grupos = result.data.listGrupos;
        this.lineas = result.data.listLineas;



        this.loading = false;
        this.loadFormulario();
        setTimeout(() => { this.ngAfterViewInitHttp() }, 200)
      } else {
        Materialize.toast(result.response.message, 4000, 'red');
        this.loading = false;
      }
    }, error => {
      this.loading = false;
      Materialize.toast('Ocurrió un error en el servicio!', 4000, 'red');
    });
    /*
     * Fin carga de catalogos necesarios para el formulario
     */
  }

  loadFormulario(): void {
    this.formCargaManual = this.fb.group({
      id_turno: new FormControl({ value: this.rowForecast.id_turno }, [Validators.required]),
      id_linea: new FormControl({ value: this.rowForecast.id_linea }, [Validators.required]),
      id_grupo: new FormControl({ value: this.rowForecast.id_grupo }, [Validators.required]),
      dia: new FormControl({ value: this.rowForecast.dia }, [Validators.required]),
      meta: new FormControl(this.rowForecast.meta, [Validators.required, Validators.pattern(/^\d*(\.[0-9]{1,10})*$/)]),
      tmp: new FormControl(this.rowForecast.tmp, [Validators.required, Validators.pattern(/^\d*(\.[0-9]{1,10})*$/)]),
      vel: new FormControl(this.rowForecast.velocidad, [Validators.required, Validators.pattern(/^\d*(\.[0-9]{1,10})*$/)]),
    });
  }

  ngAfterViewInitHttp(): void {
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
      onClose: () => {
        this.rowForecast.dia = $('#dia').val();
      }
    });
  }


  openModalConfirmacion(rowforecast: Forecast, accion: string, type: string): void {
    this.rowForecast.dia = $('#dia').val();
    this.submitted = true;
    this.mensajeModal = '';

    let descriptivoGrupo = this.obtenerDescriptivo(this.grupos,rowforecast.id_grupo);
    let descriptivoLinea = this.obtenerDescriptivoLinea(this.lineas,rowforecast.id_linea);

    if (this.formCargaManual.valid) {

      switch (accion) {
        case 'add':
          this.mensajeModal = '¿Está seguro de agregar ? ';
          break;
      }
      /* 
       * Configuración del modal de confirmación
       */
      swal({
        title: '<span style="color: #303f9f ">' + this.mensajeModal + '</span>',
        type: 'question',
        html: '<p style="color: #303f9f "> Meta para el día : <b> ' + rowforecast.dia + ' </b> Linea: <b>'+ descriptivoLinea +'</b> Grupo: <b>'+ descriptivoGrupo +'</b> Valor: <b>'+ rowforecast.meta+'</b></p>',
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
            this.service.agregar(this.auth.getIdUsuario(), rowforecast).subscribe(result => { 
              console.log('result insert', result)             
              if (result.response.sucessfull) {
                Materialize.toast('Se agregó correctamente', 4000, 'green');
                this.formCargaManual.reset();
                this.submitted = false;
              } else {
                Materialize.toast(result.response.message, 4000, 'red');
              }
            }, eror => {
              Materialize.toast('Ocurrió un error en el servicio!', 4000, 'red');
            });

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

  obtenerDescriptivo(array:Array<Catalogo>, id:number):string{
    let el = array.filter((el)=>el.id == id);

    if(el.length > 0){
      return el[0].descripcion;
    }else{
      return "No especificado";
    }
     
  }
  obtenerDescriptivoLinea(array:Array<Linea>, id:number):string{
    let el = array.filter((el)=>el.id_linea == id);

    if(el.length > 0){
      return el[0].descripcion;
    }else{
      return "No especificado";
    }
     
  }

  regresar() {
    $('.tooltipped').tooltip('hide');
  }




}
