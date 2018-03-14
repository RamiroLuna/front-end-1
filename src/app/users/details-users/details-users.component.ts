import { Component, OnInit } from '@angular/core';
import { Catalogo } from '../../models/catalogo';
import { UserSonarh } from '../../models/user-sonarh';
import { AuthService } from '../../auth/auth.service';
import { DetailsUsersService } from './details-users.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';

declare var $: any;
declare var Materialize: any;
@Component({
  selector: 'app-details-users',
  templateUrl: './details-users.component.html',
  providers: [DetailsUsersService]
})
export class DetailsUsersComponent implements OnInit {

  public usuario: UserSonarh;
  public loading: boolean;
  public perfiles: Array<Catalogo> = [];
  public turnos: Array<Catalogo> = [];
  public formPerfilSonarh: FormGroup;
  public submitted: boolean;

  constructor(
    private auth: AuthService,
    private service: DetailsUsersService,
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder
  ) { }

  ngOnInit() {
    this.loading = true;
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
      let id_usuario_sonarh = parseInt(params.get('id'));
      this.service.getDetalleUsuarioSonarh(this.auth.getIdUsuario(), id_usuario_sonarh).subscribe(result => {
        if (result.response.sucessfull) {
          this.loading = false;
          this.usuario = result.data.usuarioSonarth || new UserSonarh();
          this.usuario.id_perfil = 6;
          this.loadFormulario();
        } else {
          Materialize.toast(result.response.message, 4000, 'red');
          this.loading = false;
        }
      }, error => {
        Materialize.toast('Ocurrió un error en el servicio!', 4000, 'red');
        this.loading = false;
      });
    });

  }


  loadFormulario(): void {
    this.formPerfilSonarh = this.fb.group({
      turno: new FormControl(this.usuario.id_turno, [Validators.required]),
      perfil: new FormControl(this.usuario.id_perfil, [Validators.required])
    });
  }


  modalConfirmacion(usuario: UserSonarh) {

    this.submitted = true;
    if (this.formPerfilSonarh.valid) {

      this.service.altaUsuario(this.auth.getIdUsuario(), usuario).subscribe(
        result => {
          this.submitted = false;

          if (result.response.sucessfull) {

            Materialize.toast('Alta exitosa!', 4000, 'green');
            this.router.navigate(['home/usuarios/etad']);

          } else {
            Materialize.toast(result.response.message, 4000, 'red');
          }
        }, error => {
          Materialize.toast('Ocrrió error en el servicio', 4000, 'red');
        }
      );
    }
    else {
      Materialize.toast('Se encontrarón errores!', 4000, 'red');
    }


  }




}
