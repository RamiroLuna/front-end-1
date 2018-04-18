import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { FormularioMetasService } from './formulario-metas.service';
import { AuthService } from '../../auth/auth.service';
import { Linea } from '../../models/linea';
import { Meta } from '../../models/meta';
import { isValidId } from '../../utils';
import swal from 'sweetalert2';

declare var $: any;
declare var Materialize: any;
@Component({
  selector: 'app-formulario-metas',
  templateUrl: './formulario-metas.component.html',
  providers: [FormularioMetasService]
})
export class FormularioMetasComponent implements OnInit {
  public loading: boolean;
  public lineas: Array<Linea>;
  public meta: Meta;
  public seccion: string;
  public formMeta: FormGroup;
  public submitted: boolean;
  public mensajeModal: string;
  public texto_btn: string;
  public id: any; //Id seleccionado


  constructor(
    private service: FormularioMetasService,
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
        this.service.getMeta(this.auth.getIdUsuario(), this.id).subscribe(result => {
          if (result.response.sucessfull) {
            this.meta = result.data.metasDTO;
            /*
             * Solo carga la linea en modo de consulta para la vista
             */
            this.lineas = [
            //   {
            //   id_linea: result.data.metasDTO.id_linea,
            //   descripcion: result.data.metasDTO.linea,
            //   activo: -1,
            //   id_gpo_linea: -1,
            //   descripcion_gpo_linea: 'default'
            // }
          ];
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
        /*
     * Consulta el elemento del catalogo
     */
        this.service.getLineas(this.auth.getIdUsuario()).subscribe(result => {
          if (result.response.sucessfull) {
            this.lineas = result.data.listLineasDTO || [];
          } else {
            Materialize.toast(result.response.message, 4000, 'red');
          }
        }, error => {
          Materialize.toast('Ocurrió un error en el servicio!', 4000, 'red');
        });
        this.meta = new Meta();
        this.loadFormulario();
        this.loading = false;
      }



    } else {
      this.loading = false;
    }
    /*
     * Fin cosulta catalogo
     */
  }


  loadFormulario(): void {
    this.formMeta = this.fb.group({
      id_linea: new FormControl({ value: this.meta.id_linea, disabled: this.seccion == 'edit' }, [Validators.required]),
      meta: new FormControl(this.meta.meta, [Validators.required]),
      medida: new FormControl(this.meta.tipo_medida, [Validators.required]),
    });
  }

  openModalConfirmacion(meta: Meta, accion: string, type: string): void {

    this.submitted = true;
    this.mensajeModal = '';

    if (this.formMeta.valid) {

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
        html: '<p style="color: #303f9f "> Meta : ' + meta.meta + '<b> </b></p>',
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
            this.service.agregar(this.auth.getIdUsuario(), meta).subscribe(result => {
              if (result.response.sucessfull) {
                Materialize.toast('Se agregó correctamente', 4000, 'green');
                this.router.navigate(['../../metas'], { relativeTo: this.route });
              } else {
                Materialize.toast(result.response.message, 4000, 'red');
              }
            }, eror => {
              Materialize.toast('Ocurrió un error en el servicio!', 4000, 'red');
            });
          } else if (this.seccion == 'edit') {
            this.service.update(this.auth.getIdUsuario(), meta).subscribe(
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
