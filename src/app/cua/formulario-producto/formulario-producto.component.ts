import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { FormularioProductoService } from './formulario-producto.service';
import { AuthService } from '../../auth/auth.service';
import { isValidId } from '../../utils';
import { Producto } from '../../models/producto';
import swal from 'sweetalert2';
import { Linea } from '../../models/linea';

declare var $: any;
declare var Materialize: any;
@Component({
  selector: 'app-formulario-producto',
  templateUrl: './formulario-producto.component.html',
  providers: [FormularioProductoService]
})
export class FormularioProductoComponent implements OnInit {
  public loading: boolean;
  public seccion: string;
  public submitted: boolean;
  public mensajeModal: string;
  public texto_btn: string;
  public producto: Producto;
  public formProducto: FormGroup;
  public lineas: Array<Linea>;
  public id: any; //Id seleccionado
  constructor(
    private service: FormularioProductoService,
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
        this.service.getProducto(this.auth.getIdUsuario(), this.id).subscribe(result => {
          if (result.response.sucessfull) {
            this.producto = result.data.productoDTO;
            this.loadFormulario();
            this.loading = false;
          } else {
            Materialize.toast(result.response.message, 4000, 'red');
            this.loading = false;
          }
        }, error => {
          Materialize.toast('Ocurrió un error en el servicio!', 4000, 'red');
          this.loading = false;
        });
      } else if (this.seccion == 'add') {
        this.service.getLineas(this.auth.getIdUsuario()).subscribe(result => {
          if (result.response.sucessfull) {
            this.lineas = result.data.listLineasDTO || [];
          } else {
            Materialize.toast(result.response.message, 4000, 'red');
          }
        }, error => {
          Materialize.toast('Ocurrió un error en el servicio!', 4000, 'red');
        });
        this.producto = new Producto();
        this.loadFormulario();
        this.loading = false;
      }

    } else {
      this.loading = false;
    }

  }

  loadFormulario(): void {
    this.formProducto = this.fb.group({
      id_linea: new FormControl({ value: this.producto.id_linea}, [Validators.required]),
      descripcion: new FormControl(this.producto.descripcion, [Validators.required]),
      medida: new FormControl(this.producto.medida, [Validators.required]),
    });
  }

  openModalConfirmacion(producto: Producto, accion: string, type: string): void {

    this.submitted = true;
    this.mensajeModal = '';

    if (this.formProducto.valid) {

      switch (accion) {
        case 'add':
          this.mensajeModal = '¿ Está seguro de agregar ? ';
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
        html: '<p style="color: #303f9f "> Producto : ' + producto.descripcion + '<b> </b></p>',
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
            this.service.agregar(this.auth.getIdUsuario(), producto).subscribe(result => {
              if (result.response.sucessfull) {
                Materialize.toast('Se agregó correctamente', 4000, 'green');
                this.router.navigate(['../../productos'], { relativeTo: this.route });
              } else {
                Materialize.toast(result.response.message, 4000, 'red');
              }
            }, eror => {
              Materialize.toast('Ocurrió un error en el servicio!', 4000, 'red');
            });
          } else if (this.seccion == 'edit') {
            this.service.update(this.auth.getIdUsuario(), producto).subscribe(
              result => {
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
