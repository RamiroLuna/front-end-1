import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { FormularioFallasService } from './formulario-fallas.service';
import { AuthService } from '../../auth/auth.service';
import { isValidId } from '../../utils';
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
export class FormularioFallasComponent implements OnInit {
  public loading: boolean;
  public seccion: string;
  public submitted: boolean;
  public mensajeModal: string;
  public texto_btn: string;
  public textoFormulario: string;
  public falla: Falla;
  public formFalla: FormGroup;
  /* Catalogos requeridos */
  public lineas: Array<Linea>;
  public grupos: Array<Catalogo>;
  public turnos: Array<Catalogo>;
  public fuentes: Array<Catalogo>;
  public razones: Array<RazonParo> =[];
  public todasRazones: Array<RazonParo>=[];
  public equipos: Array<Equipo>;

  public id: any; //Id seleccionado
  constructor(
    private service: FormularioFallasService,
    private auth: AuthService,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router) { }

  ngOnInit() {
    this.loading = true;
    this.submitted = false;
    this.texto_btn = "Cancelar";
    this.textoFormulario = "";
    this.falla = new Falla();

    this.route.paramMap.subscribe(params => {
      if (params.get('id') == 'nuevo') {
        this.textoFormulario = "Capture datos para registrar la falla del turno:";
        this.seccion = 'add';
      } else if (isValidId(params.get('id'))) {
        this.textoFormulario = "Actualice datos de la falla:";
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
        this.service.getFalla(this.auth.getIdUsuario(), this.id).subscribe(result => {

          if (result.response.sucessfull) {

            this.loadFormulario();
            this.loading = false;

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

          console.log('resultado de catalogos', result)

          if (result.response.sucessfull) {           
            this.lineas = [];
            this.grupos = [];
            this.turnos = [];
            this.todasRazones = result.data.listRazonesParo || [];
            this.fuentes = result.data.listFuentesParo || [];
            this.equipos =  result.data.listEquipos || [];
            this.falla.dia = result.data.metasDTO.dia_string || ""; 
  
            this.seccion = "ok";
            this.loading = false;  
            this.loadFormulario();
            setTimeout(()=>this.ngAfterViewHttp(),100);
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
      dia: new FormControl({ value: this.falla.dia, disabled: true}, [Validators.required]),
      id_linea: new FormControl({value: this.falla.id_linea, disabled: true}, [Validators.required]),
      id_grupo: new FormControl({value: this.falla.id_grupo, disabled: true}, [Validators.required]),
      id_turno: new FormControl({value: this.falla.id_grupo,disabled: true} , [Validators.required]),
      id_fuente: new FormControl(this.falla.id_fuente, [Validators.required]),
      id_razon: new FormControl(this.falla.id_razon, [Validators.required]),
      id_equipo: new FormControl(this.falla.id_equipo, [Validators.required]),
      descripcion_equipo: new FormControl({value: this.falla.descripcion_equipo , disabled:true}),
      hora_inicio: new FormControl(this.falla.hora_inicio, [Validators.required]),
      hora_final: new FormControl(this.falla.hora_final, [Validators.required]),
      tiempo_paro: new FormControl(this.falla.tiempo_paro, [Validators.required]),
      descripcion: new FormControl(this.falla.descripcion, [Validators.required]),
    });
  }

  /*
   * Carga plugins despues de cargar y mostrar objetos en el DOM
   */
  ngAfterViewHttp(): void {
    $('textarea#problema').characterCounter();
    $('.tooltipped').tooltip({ delay: 50 });
    $('.timepicker').pickatime({
      clear: ''
    })
  }

  agregar() {
    $('.tooltipped').tooltip('hide');
  }

  regresar() {
    $('.tooltipped').tooltip('hide');
  }


  chnageFuenteParo(idFuenteParo:number):void{
   this.razones =  this.todasRazones.filter((el)=>el.id_fuente_paro == idFuenteParo);
  }

  changeEquipo(idEquipo:number):void{
  
    let el =  this.equipos.filter((el)=>el.id_equipos == idEquipo);
   
    if(el.length > 0){
      this.falla.descripcion_equipo =  el[0].descripcion;
    }else{
      this.falla.descripcion_equipo = "";
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
        html: '<p style="color: #303f9f "> Dia : <b>' + falla.dia + '</b> <b> Linea</b> : ' + falla.id_linea + '</b></p>',
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
            // this.service.agregar(this.auth.getIdUsuario(), producto).subscribe(result => {
            //   if (result.response.sucessfull) {
            //     Materialize.toast('Se agregó correctamente', 4000, 'green');
            //     this.router.navigate(['../../productos'], { relativeTo: this.route });
            //   } else {
            //     Materialize.toast(result.response.message, 4000, 'red');
            //   }
            // }, eror => {
            //   Materialize.toast('Ocurrió un error en el servicio!', 4000, 'red');
            // });
          } else if (this.seccion == 'edit') {
            // this.service.update(this.auth.getIdUsuario(), producto).subscribe(
            //   result => {
            //     if (result.response.sucessfull) {
            //       Materialize.toast('Actualización completa', 4000, 'green');
            //       this.texto_btn = 'Cerrar ficha';
            //     } else {
            //       Materialize.toast(result.response.message, 4000, 'red');
            //     }
            //   }, error => {
            //     Materialize.toast('Ocurrió un error en el servicio!', 4000, 'red');
            //   });
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


}
