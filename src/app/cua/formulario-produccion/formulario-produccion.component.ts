import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { Router } from '@angular/router';
import swal from 'sweetalert2';
import { Producto } from '../../models/producto';
import { AuthService } from '../../auth/auth.service';
import { FormularioProduccionService } from './formulario-produccion.service';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { Linea } from '../../models/linea';
import { Catalogo } from '../../models/catalogo';
import { isNumeroAsignacionValid,findRol } from '../../utils';



declare var $: any;
declare var Materialize: any;

@Component({
  selector: 'app-formulario-produccion',
  templateUrl: './formulario-produccion.component.html',
  providers: [FormularioProduccionService]
})
export class FormularioProduccionComponent implements OnInit {

  @Input() idMeta: number;
  @Input() seccion: string = "add";
  @Output() accion = new EventEmitter();

  public loading: boolean;
  public insertProduccion: boolean;
  public modificacion: boolean;
  public mensaje: string;
  public formulario: FormGroup;
  public meta: any = {
    id_meta: 0,
    id_linea: 0,
    id_turno: 0,
    id_grupo: 0,
    diaString: ''
  }
  public productos: Array<Producto>;
  public cloneProductos: Array<Producto>;
  public lineas: Array<Linea>;
  public grupos: Array<Catalogo>;
  public turnos: Array<Catalogo>;

  public permission: any = {
    updateProduccion:false
  }



  constructor(
    private router: Router,
    private auth: AuthService,
    private fb: FormBuilder,
    private service: FormularioProduccionService
  ) { }

  ngOnInit() {
    this.permission.updateProduccion = findRol(19, this.auth.getRolesCUA());
    this.loading = true;
    this.insertProduccion = true;
    this.modificacion = false;
    this.productos = [];
    this.lineas = [];
    this.grupos = [];
    this.turnos = [];

    if (this.seccion == 'add') {
      this.service.init(this.auth.getIdUsuario()).subscribe(result => {
        if (result.response.sucessfull) {
          this.grupos = result.data.listGrupos || [];
          this.lineas = result.data.listLineas || [];
          this.turnos = result.data.listTurnos || [];
          this.productos = result.data.listProductos || [];
          this.meta.id_meta = result.data.meta.id_meta;
          this.meta.diaString = result.data.meta.dia;
          this.meta.id_linea = result.data.meta.id_linea;
          this.meta.id_turno = result.data.meta.id_turno;
          this.meta.id_grupo = result.data.meta.id_grupo;
          this.insertProduccion = true;
          this.loading = false;
          this.loadFormulario();
          setTimeout(() => this.ngAfterViewInit(), 20);
        } else {
          this.loading = false;
          if (result.response.message == "0") {
            this.insertProduccion = false;
            this.mensaje = "No puede registrar producción. No existe meta";
            Materialize.toast("No puede registrar producción", 4000, 'red');
          } else if (result.response.message == "-1") {
            this.mensaje = "Ya capturó producción. Si desea modificar un dato contacte a su Facilitador";
            this.insertProduccion = false;
            Materialize.toast("No puede registrar producción", 4000, 'red');
          } else {
            Materialize.toast(result.response.message, 4000, 'red');
          }
        }
      }, error => {
        this.loading = false;
        Materialize.toast('Ocurrió un error en el servicio!', 4000, 'red');
      });
    } else if (this.seccion == 'consulta') {
      this.service.getDetailsProduccion(this.auth.getIdUsuario(), this.idMeta).subscribe(result => {
        if (result.response.sucessfull) {
          this.grupos = result.data.listGrupos || [];
          this.lineas = result.data.listLineas || [];
          this.turnos = result.data.listTurnos || [];
          this.productos = result.data.listDetalle || [];
          this.cloneProductos = Object.assign([], result.data.listDetalle || []);
          this.meta.id_meta = result.data.meta.id_meta;
          this.meta.diaString = result.data.meta.dia;
          this.meta.id_linea = result.data.meta.id_linea;
          this.meta.id_turno = result.data.meta.id_turno;
          this.meta.id_grupo = result.data.meta.id_grupo;

          this.loading = false;
          this.loadFormulario();
          setTimeout(() => this.ngAfterViewInit(), 20);
        } else {
          this.loading = false;
          Materialize.toast(result.response.message, 4000, 'red');
        }
      }, error => {
        this.loading = false;
        Materialize.toast('Ocurrió un error en el servicio!', 4000, 'red');
      });

    }
  }

  loadFormulario(): void {
    this.formulario = this.fb.group({
      diaString: new FormControl({ value: this.meta.diaString, disabled: true }, [Validators.required]),
      id_linea: new FormControl({ value: this.meta.id_linea, disabled: true }, [Validators.required]),
      id_grupo: new FormControl({ value: this.meta.id_grupo, disabled: true }, [Validators.required]),
      id_turno: new FormControl({ value: this.meta.id_turno, disabled: true }, [Validators.required])
    });

  }

  /* 
  * Carga de plugins para el componente
  */
  ngAfterViewInit(): void {
    $('.tooltipped').tooltip({ delay: 50 });
  }

  regresar() {
    $('.tooltipped').tooltip('hide');
  }

  back() {
    $('.tooltipped').tooltip('hide');
    this.accion.emit();
  }


  modalQuestionRegistrarProduccion(): void {
    if (this.isValidAsignacion('asignacion_productos')) {
      /* 
        * Configuración del modal de confirmación
        */
      swal({
        title: '<span style="color: #303f9f "> ¿ Está seguro registrar la producción ? </span>',
        type: 'question',
        showCancelButton: true,
        confirmButtonColor: '#303f9f',
        cancelButtonColor: '#9fa8da ',
        cancelButtonText: 'Cancelar',
        confirmButtonText: 'Si, registrar',
        allowOutsideClick: false,
        allowEnterKey: false
      }).then((result) => {
        /*
         * Si acepta
         */
        if (result.value) {
          let arregloAsignaciones: Array<any> = [];

          this.productos.map((el) => {
            arregloAsignaciones.push({ 'id_producto': el.id_producto, 'valor': parseFloat(el.asignacion) });
          });

          this.service.agregar(this.auth.getIdUsuario(), arregloAsignaciones, this.meta.id_meta).subscribe(result => {

            if (result.response.sucessfull) {
              Materialize.toast('Producción registrada', 4000, 'green');

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
      Materialize.toast('Todas las asignaciones deben ser números y obligatorias', 4000, 'red');
    }

  }

  modalQuestionFails(): void {

    /* 
      * Configuración del modal de confirmación
      */
    swal({
      title: '<span style="color: #303f9f "> ¿ Registrar fallas del turno? </span>',
      type: 'question',
      //html: '<p style="color: #303f9f "> Linea : ' + meta.meta + '<b> </b></p>',
      showCancelButton: true,
      confirmButtonColor: '#303f9f',
      cancelButtonColor: '#9fa8da ',
      cancelButtonText: 'No hubo fallas',
      confirmButtonText: 'Si, registrar',
      allowOutsideClick: false,
      allowEnterKey: false
    }).then((result) => {
      /*
       * Si acepta
       */
      if (result.value) {
        this.router.navigate(['home/cua/opciones/fallas/nuevo']);
        /*
        * Si cancela accion
        */
      } else if (result.dismiss === swal.DismissReason.cancel) {
        this.router.navigate(['home/cua/opciones/produccion']);
      }
    })

  }

  modificarProduccion() {

    if (this.isValidAsignacionUpdate('asignacion_productos')) {
      /* 
        * Configuración del modal de confirmación
        */
      swal({
        title: '<span style="color: #303f9f "> ¿ Está seguro modificar la producción ? </span>',
        type: 'question',
        showCancelButton: true,
        confirmButtonColor: '#303f9f',
        cancelButtonColor: '#9fa8da ',
        cancelButtonText: 'Cancelar',
        confirmButtonText: 'Si, registrar',
        allowOutsideClick: false,
        allowEnterKey: false
      }).then((result) => {
        /*
         * Si acepta
         */
        if (result.value) {
          let arregloAsignaciones: Array<any> = [];

          this.productos.map((el) => {
            arregloAsignaciones.push({ 'id_produccion': el.id_produccion, 'valor': parseInt(el.valor) });
          });

          this.service.update(this.auth.getIdUsuario(), arregloAsignaciones).subscribe(result => {

            if (result.response.sucessfull) {

              this.productos.forEach((el, index, arg) => {
                let kilos = parseFloat(el.valor) / 1000;
                arg[index].valor = "" + kilos;
              });

              this.modificacion = false;
              Materialize.toast('Modificación exitosa', 4000, 'green');

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
      Materialize.toast('Todas las asignaciones deben ser números y obligatorias', 4000, 'red');
    }

  }

  isValidAsignacion(clase: string): boolean {
    let bandera: boolean = true;
    this.productos.forEach(el => {
      if (!isNumeroAsignacionValid(el.asignacion)) {
        bandera = false;
      }
    });
    return bandera;
  }

  isValidAsignacionUpdate(clase: string): boolean {
    let bandera: boolean = true;
    this.productos.forEach(el => {
      if (!isNumeroAsignacionValid(el.valor)) {
        bandera = false;
      }
    });
    return bandera;
  }

  modificarDatos(event): void {
    event.preventDefault();
    this.modificacion = !this.modificacion;

    if (this.modificacion) {

      this.productos.forEach((el, index, arg) => {
        let kilos = parseFloat(el.valor) * 1000;
        arg[index].valor = "" + kilos;
      });

    } else {

      this.service.getDetailsProduccion(this.auth.getIdUsuario(), this.idMeta).subscribe(result => {
        if (result.response.sucessfull) {
          this.productos = result.data.listDetalle || [];
        } else {
          Materialize.toast(result.response.message, 4000, 'red');
        }
      }, error => {

        Materialize.toast('Ocurrió un error en el servicio!', 4000, 'red');
      });

    }
  }

}
