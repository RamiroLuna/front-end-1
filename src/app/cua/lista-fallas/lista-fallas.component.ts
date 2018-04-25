import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { ListaFallasService } from './lista-fallas.service';
import { DataTable } from '../../utils';
import { Falla } from '../../models/falla';
import { Linea } from '../../models/linea';
import { Catalogo } from '../../models/catalogo';
import { AuthService } from '../../auth/auth.service';

declare var $: any;
declare var Materialize: any;
@Component({
  selector: 'app-lista-fallas',
  templateUrl: './lista-fallas.component.html',
  providers: [ ListaFallasService ]
})
export class ListaFallasComponent implements OnInit {

 public loading: boolean;
 public submitted: boolean;
 public formBusqueda: FormGroup;
 public paramsBusqueda:any;


  public fallas:Array<Falla> = [];
   /* Catalogos requeridos */
   public lineas: Array<Linea>;
   public grupos: Array<Catalogo>;
   public turnos: Array<Catalogo>;

  constructor(
    private service: ListaFallasService,
    private auth: AuthService,
    private fb: FormBuilder,) { }

  ngOnInit() {

    this.loading = true;
    this.submitted = false;
    this.paramsBusqueda = {};

    this.service.getCatalogos(this.auth.getIdUsuario()).subscribe(result => {    

      if (result.response.sucessfull) {           
        this.lineas = result.data.listLineas || [];
        this.grupos = result.data.listGrupos || [];
        this.turnos = result.data.listTurnos || [];

     
        this.loading = false;  
        this.loadFormulario();

        setTimeout(() => {this.ngAfterViewHttp();},200)
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
      inicio: new FormControl({value: this.paramsBusqueda.inicio, disabled: false}, [Validators.required]),
      fin: new FormControl({value: this.paramsBusqueda.fin, disabled: false}, [Validators.required]),
      id_linea: new FormControl({value: this.paramsBusqueda.id_linea, disabled: false}, [Validators.required]),
      id_grupo: new FormControl({value: this.paramsBusqueda.id_grupo, disabled: false}, [Validators.required]),
      id_turno: new FormControl({value: this.paramsBusqueda.id_turno, disabled: false}, [Validators.required])
    });
    
  }

    /*
   * Carga plugins despues de cargar y mostrar objetos en el DOM
   */
  ngAfterViewHttp(): void{

    DataTable('#tabla');
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
          this.paramsBusqueda.inicio =  $('.inicio').val();
          this.paramsBusqueda.fin =  $('.fin').val();
      }
    });

   } 

  agregar() {
    $('.tooltipped').tooltip('hide');
  }

  regresar() {
    $('.tooltipped').tooltip('hide');
  }

  busqueda(parametrosBusqueda:any){
    this.submitted = true;
    
    if (this.formBusqueda.valid) {
      
    }else{
      Materialize.toast('Ingrese todos los datos para mostrar fallas!', 4000, 'red');
    }


  }
  

}
