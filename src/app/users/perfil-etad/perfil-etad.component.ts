import { Component, OnInit, AfterViewInit, EventEmitter } from '@angular/core';
import { PerfilEtadService } from './perfil-etad.service';
import { AuthService } from '../../auth/auth.service';
import { User } from '../../models/user';
import { Catalogo } from '../../models/catalogo';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import swal from 'sweetalert2';

declare var $: any;
declare var Materialize: any;

@Component({
  selector: 'app-perfil-etad',
  templateUrl: './perfil-etad.component.html',
  providers: [PerfilEtadService]
})
export class PerfilEtadComponent implements OnInit {

  public usuario: User;
  public loading: boolean;
  public perfiles: Array<Catalogo> = [];
  public turnos: Array<Catalogo> = [];
  public formPerfilEtad: FormGroup;
  public submitted: boolean;
  public usuario_en_etad: boolean;

  constructor(
    private auth: AuthService,
    private service: PerfilEtadService,
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder
  ) { }

  ngOnInit() {

    this.loading = true;
    this.usuario_en_etad = false;

    this.service.getCatalogo(this.auth.getIdUsuario(), 'pet_cat_perfiles').subscribe(result => {

      if (result.response.sucessfull) {
        this.perfiles = result.data.listCatalogosDTO || [];

      } else {
        Materialize.toast('Error al cargar catalogo de perfiles', 4000, 'red');
      }
    }, error => {
      Materialize.toast('Ocurrió un error en el servicio!', 4000, 'red');
    });

    this.service.getCatalogo(this.auth.getIdUsuario(), 'pet_cat_turnos').subscribe(result => {
      if (result.response.sucessfull) {
        this.turnos = result.data.listCatalogosDTO || [];

      } else {
        Materialize.toast(result.response.message, 4000, 'red');
      }
    }, error => {
      Materialize.toast('Error al cargar catalogo de turnos', 4000, 'red');
    });

    this.route.paramMap.subscribe(params => {
      let id_usuario_etad = parseInt(params.get('id'));
      this.service.getPerfilEtad(this.auth.getIdUsuario(), id_usuario_etad).subscribe(result => {
        console.log('resultado para el perfil de etad ', result)
        if (result.response.sucessfull) {
          this.loading = false;
          this.usuario = result.data.userDTO || new User();
          this.usuario_en_etad = true;
          this.loadFormulario();
        } else {
          Materialize.toast(result.response.message, 4000, 'red');
          this.loading = false;
          this.usuario_en_etad = false;
        }
      }, error => {
        Materialize.toast('Ocurrió un error en el servicio!', 4000, 'red');
        this.loading = false;
        this.usuario_en_etad = false;
      });
    });
  }

  loadFormulario(): void {
    // this.formPerfilEtad = this.fb.group({
    //   turno: new FormControl(this.usuario.id_turno, [Validators.required]),
    //   perfil: new FormControl(this.usuario.id_perfil, [Validators.required])
    // });
  }

  modalConfirmacion(usuario: User): void {

    this.submitted = true;

    if (this.formPerfilEtad.valid) {
      /* 
          * Configuración del modal de confirmación
          */
      swal({
        title: '<span style="color: #303f9f "> ¿ Está seguro de actualizar información ?</span>',
        type: 'question',
        // html: '<p style="color: #303f9f "> Usuario: <b>' + usuario.nombre + ' </b></p>',
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
          
          this.submitted = false;

          this.service.update(this.auth.getIdUsuario(), usuario).subscribe(
            result => {
              

              if (result.response.sucessfull) {

                Materialize.toast('Actualización exitosa!', 4000, 'green');

              } else {
                Materialize.toast(result.response.message, 4000, 'red');
              }
            }, error => {
              Materialize.toast('Ocrrió error en el servicio', 4000, 'red');
            }
          );
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
