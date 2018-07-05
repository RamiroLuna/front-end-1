import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../../auth/auth.service';
import { Meta } from '../../models/meta';
import { deleteItemArray, getAnioActual, calculaDiaPorMes, isNumeroAsignacionValid, findRol } from '../../utils';
import swal from 'sweetalert2';
import { ListaPonderacionService } from './lista-ponderacion.service';
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


declare var $: any;
declare var Materialize: any;
@Component({
  selector: 'app-lista-ponderacion',
  templateUrl: './lista-ponderacion.component.html',
  providers: [ListaPonderacionService],
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
export class ListaPonderacionComponent implements OnInit {

  public loading: boolean;
  public datos_tabla: boolean;
  public mensajeModal: string;


  public anioSeleccionado: number;
  public submitted: boolean;
  public disabled: boolean;

  public ponderaciones: Array<any> = [];


  public anios: any = {};


  public status: string;
  public anios_con_obj_cargados: number;



  public permission: any = {
    editarMeta: false,
    eliminarMeta: false
  }

  constructor(private auth: AuthService,
    private service: ListaPonderacionService,
    private fb: FormBuilder
  ) { }

  ngOnInit() {
    this.loading = true;
    this.datos_tabla = false;
    this.submitted = false;
    this.disabled = false;


    // this.permission.editarMeta = findRol(3, this.auth.getRolesOee());
    // this.permission.eliminarMeta = findRol(5, this.auth.getRolesOee());

    this.service.getInitCatalogos(this.auth.getIdUsuario()).subscribe(result => {
      console.log('init', result)
      if (result.response.sucessfull) {
        let anios_temporal = result.data.listYearsOP || [];
        if (anios_temporal.length > 0) {
          anios_temporal.map(el => {
            this.anios[el.result] = el.result;
          });
        }
        this.anios_con_obj_cargados = anios_temporal.length;
        this.anioSeleccionado = anios_temporal[0].result;


        if (this.anios_con_obj_cargados > 0) {

          this.service.getPonderacion(this.auth.getIdUsuario(), 1, this.anioSeleccionado).subscribe(result => {
            console.log('rrrrr', result)
            if (result.response.sucessfull) {
              this.ponderaciones = result.data.listPonderacionObjetivos || [];
              this.datos_tabla = true;
              this.disabled = false;

              setTimeout(() => {
                this.ngAfterViewInitHttp();
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


        this.loading = false;
        this.loadFormulario();
        setTimeout(() => { this.ngAfterViewInitHttp() }, 200)
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
  }




  agregar() {
    $('.tooltipped').tooltip('hide');
  }

  regresar() {
    $('.tooltipped').tooltip('hide');
  }

  changeIcono(event): void {
    let icono = $(event.target).html();
    $(event.target).html(icono == 'edit' ? 'save' : 'edit');

  }

  changeCombo(): void {

    this.datos_tabla = false;
    this.status = "inactive";
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

          this.submitted = false;
          this.status = "inactive";
          this.datos_tabla = false;

          if(value != ""){
            this.anioSeleccionado = value;
          }

          this.service.getPonderacion(this.auth.getIdUsuario(), 1, this.anioSeleccionado).subscribe(result => {
            console.log('rrrrr', result)
            if (result.response.sucessfull) {
              this.ponderaciones = result.data.listPonderacionObjetivos || [];
              this.datos_tabla = true;
              this.disabled = false;

              setTimeout(() => {
                this.ngAfterViewInitHttp();
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

          if (value != '') {
            resolve();
            this.anioSeleccionado = value;

          } else {
            resolve('Seleccione un año')
          }
        })
      }
    })
  }

  loadFormulario(): void {
    // this.formConsultaPeriodo = this.fb.group({
    //   idLinea: new FormControl({ value: this.idLinea }, [Validators.required]),
    //   idPeriodo: new FormControl({ value: this.idPeriodo }, [Validators.required])
    // });
  }


  consultaPeriodo(): void {
    this.submitted = true;
    this.status = "inactive";

    // if (this.formConsultaPeriodo.valid) {
    this.disabled = true;
    this.datos_tabla = false;

    this.service.getPonderacion(this.auth.getIdUsuario(), this.anioSeleccionado, 1).subscribe(result => {
      console.log('result de ponderaciones', result)
      if (result.response.sucessfull) {

        this.ponderaciones = result.data.listPonderacionObjetivos || [];
        this.datos_tabla = true;
        this.disabled = false;

        setTimeout(() => {
          this.ngAfterViewInitHttp();
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

    // } else {
    //   Materialize.toast('Verifique los datos capturados!', 4000, 'red');
    // }



  }

  openModalConfirmacion(rowForecast: Meta, accion: string, event?: any): void {
    this.mensajeModal = '';

    switch (accion) {
      case 'eliminar':
        this.mensajeModal = '¿Está seguro de eliminar? ';
        break;
    }

    /* 
     * Configuración del modal de confirmación
     */
    swal({
      title: '<span style="color: #303f9f ">' + this.mensajeModal + '</span>',
      type: 'question',
      html: '<p style="color: #303f9f "> Dia : <b>' + rowForecast.dia_string + ' </b>Turno: <b>' + rowForecast.id_turno + '</b> Grupo: <b>' + rowForecast.nombre_grupo + '</b></p>',
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
            // this.service.delete(this.auth.getIdUsuario(), rowForecast.id_meta).subscribe(result => {
            //   if (result.response.sucessfull) {
            //     deleteItemArray(this.metas, rowForecast.id_meta, 'id_meta');
            //     Materialize.toast('Se eliminó correctamente ', 4000, 'green');
            //   } else {

            //     Materialize.toast(result.response.message, 4000, 'red');
            //   }
            // }, error => {
            //   Materialize.toast('Ocurrió  un error en el servicio!', 4000, 'red');
            // });
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

  findRowForecast(metas: Array<Meta>, id_meta: number): Meta {
    let meta: Meta;
    let el = metas.filter(el => el.id_meta == id_meta);
    if (el.length > 0) {
      meta = el[0];
    }
    return meta;
  }

}
