import { Component, OnInit, AfterViewInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { Catalogo } from '../../../models/catalogo';
import { isValidId } from '../../../utils';
import { AuthService } from '../../../auth/auth.service';
import { FormularioDetalleServiceService } from './formulario-detalle-service.service';

declare var $: any;
declare var Materialize: any;
@Component({
  selector: 'app-formulario-detalle',
  templateUrl: './formulario-detalle.component.html',
  providers: [FormularioDetalleServiceService]
})
export class FormularioDetalleComponent implements OnInit, AfterViewInit {

  public nombre_catalogo: string;
  public nombre_tabla: string;
  public isCatalog: boolean = true;
  public link_back: string;
  public formCatalogs: FormGroup;
  public submitted: boolean;
  public itemCatalogo: Catalogo;
  public id: string;
  public seccion: string;
  public texto_btn:string;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private service: FormularioDetalleServiceService,
    private auth: AuthService
  ) { }

  ngOnInit() {
    this.submitted = false;
    this.texto_btn = "Cancelar";
    this.route.paramMap.subscribe(params => {

      if (params.get('id') == 'nuevo') {
        this.itemCatalogo = new Catalogo();
        this.seccion = 'add';
      } else if (isValidId(params.get('id'))) {
        this.seccion = 'edit';
        this.itemCatalogo = new Catalogo();
      } else {
        this.seccion = 'invalid';
      }


      if (this.seccion != 'invalid') {
        switch (params.get('name')) {
          case 'perdidas':
            this.nombre_catalogo = 'Perdida';
            this.nombre_tabla = 'pet_cat_perdida';
            break;
          case 'planeado':
            this.nombre_catalogo = 'Paro planeado';
            this.nombre_tabla = 'pet_cat_planeado';
            break;
          case 'no_planeado':
            this.nombre_catalogo = 'Paro no planeado';
            this.nombre_tabla = 'pet_cat_noplaneado';
            break;
          case 'reduccion':
            this.nombre_catalogo = 'Reducción';
            this.nombre_tabla = 'pet_cat_reduc_velocidad';
            break;
          case 'calidad':
            this.nombre_catalogo = 'Calidad';
            this.nombre_tabla = 'pet_cat_calidad';
            break;
          case 'extrusores':
            this.nombre_catalogo = 'Nombre de equipos extrusores';
            this.nombre_tabla = 'pet_cat_equipos_extrusores_bulher';
            break;
          case 'ssp':
            this.nombre_catalogo = 'Nombre de equipos SSP';
            this.nombre_tabla = 'pet_cat_equipos_ssp';
            break;
          case 'grupo-linea':
            this.nombre_catalogo = 'Grupos de linea';
            this.nombre_tabla = 'pet_cat_gpo_linea';
            break;
          case 'grupos':
            this.nombre_catalogo = 'Grupos';
            this.nombre_tabla = 'pet_cat_grupos';
            break;
          case 'perfiles':
            this.nombre_catalogo = 'Perfiles';
            this.nombre_tabla = 'pet_cat_perfiles';
            break;
          case 'turnos':
            this.nombre_catalogo = 'Turno';
            this.nombre_tabla = 'pet_cat_turnos';
            break;
          default:
            this.isCatalog = false;
        }

        if (this.seccion == 'edit') {
          this.service.getElementById(
            this.auth.getIdUsuario(),
            this.nombre_tabla,
            parseInt(params.get('id'))
          ).subscribe(result => {
            if (result.response.sucessfull) {
              this.itemCatalogo = result.data.catalogosDTO;
            } else {
              Materialize.toast(result.response.message, 4000, 'red');
            }
          }, error => {
            Materialize.toast('Ocurrió un error en el servicio!', 4000, 'red');
          });
        }
      }
      this.link_back = params.get('name');

    });

    this.formCatalogs = this.fb.group({
      descripcion: new FormControl(this.itemCatalogo.descripcion, [Validators.required])
    });

  }

  ngAfterViewInit() {
    $('.tooltipped').tooltip({ delay: 50 });
    $('#modalConfirmacion').modal({
      dismissible: false
    });
  }

  /*
   * Incial el codigo del componente
   */
  accion(item: Catalogo) {
    this.submitted = true;
    if (this.formCatalogs.valid) {
      $('#modalConfirmacion').modal('open');
    } else {
      Materialize.toast('Se encontrarón errores!', 4000, 'red');
    }

  }

  /*
   * Si cancela la accion
   */
  closeModal(action: string) {
    $('#modalConfirmacion').modal('close');
  }

  /*
   * Si confirma accion
   */
  aceptarAccion(catalogo: Catalogo) {


    if (this.seccion == 'add') {
      this.service.agregar(this.auth.getIdUsuario(), this.nombre_tabla, this.itemCatalogo).subscribe(result => {
        if (result.response.sucessfull) {
          Materialize.toast('Se agregó correctamente', 4000, 'green');
          this.router.navigate(['home/catalogos/lista', this.link_back]);
        } else {
          Materialize.toast(result.response.message, 4000, 'red');
        }
      }, eror => {
        Materialize.toast('Ocurrió un error en el servicio!', 4000, 'red');
      });
    } else if (this.seccion == 'edit') {
      this.service.update(this.auth.getIdUsuario(), this.nombre_tabla, this.itemCatalogo).subscribe(
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


    $('#modalConfirmacion').modal('close');
  }
}


