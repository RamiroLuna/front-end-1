import { Component, OnInit } from '@angular/core';
import { Catalogo } from '../../models/catalogo';
import { UserSonarh } from '../../models/user-sonarh';
import { AuthService } from '../../auth/auth.service';
import { PerfilSonarhService } from './perfil-sonarh.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { Linea } from '../../models/linea';

declare var $: any;
declare var Materialize: any;
@Component({
  selector: 'app-details-users',
  templateUrl: './perfil-sonarh.component.html',
  providers: [PerfilSonarhService]
})
export class PerfilSonarhComponent implements OnInit {

  public usuario: UserSonarh;
  public loading: boolean;
  public perfiles: Array<Catalogo> = [];
  public grupos: Array<Catalogo> = [];
  public areas_etads: Array<Catalogo> = [];
  public lineas: Array<Linea> = [];
  public lineas_disponibles: Array<Linea> = [];
  public formPerfilSonarh: FormGroup;
  public submitted: boolean;
  public usuario_en_etad: boolean;
  public existe_user: boolean;

  constructor(
    private auth: AuthService,
    private service: PerfilSonarhService,
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder
  ) { }

  ngOnInit() {
    this.existe_user = false;
    this.loading = true;
    this.usuario_en_etad = false;


    this.route.paramMap.subscribe(params => {

      let numero_empleado = parseInt(params.get('id'));
      this.service.getDetalleUsuarioSonarh(this.auth.getIdUsuario(), numero_empleado).subscribe(result => {

        if (result.response.sucessfull) {
          if (result.data.usuarioSonarh) {
            this.grupos = result.data.listGrupos || [];
            this.perfiles = result.data.listPerfiles || [];
            this.lineas_disponibles = result.data.listLineas || [];
            this.areas_etads = result.data.listEtads || [];
            this.usuario = result.data.usuarioSonarh || new UserSonarh();
            /* Por default es consulta */
            this.usuario.id_perfiles = [6];

            this.usuario_en_etad = false;
            this.existe_user = true;
            this.loading = false;
            this.loadFormulario();
          } else {
            this.loading = false;
            this.existe_user = false;
          }

        } else {
          Materialize.toast(result.response.message, 4000, 'red');
          this.loading = false;
          this.usuario_en_etad = true;
        }
      }, error => {
        Materialize.toast('Ocurrió un error en el servicio!', 4000, 'red');
        this.loading = false;
        this.usuario_en_etad = false;
      });
    });

  }







  loadFormulario(): void {
    this.formPerfilSonarh = this.fb.group({
      nombre: new FormControl({ value: this.usuario.Nombre, disabled: true }, [Validators.required]),
      NumEmpleado: new FormControl({ value: this.usuario.NumEmpleado, disabled: true }, [Validators.required]),
      Area: new FormControl({ value: this.usuario.Area, disabled: true }, [Validators.required]),
      id_grupo: new FormControl({ value: this.usuario.id_grupo, disabled: true }, [Validators.required]),
      id_linea: new FormControl({ value: this.usuario.id_linea }, [Validators.required]),
      id_perfiles: new FormControl({ value: this.usuario.id_perfiles }, [Validators.required]),
      id_etad: new FormControl({ value: this.usuario.id_etad }, [Validators.required])
    });
  }


  modalConfirmacion(usuario: UserSonarh) {

    this.submitted = true;
    if (this.formPerfilSonarh.valid) {

      this.service.altaUsuario(this.auth.getIdUsuario(), usuario).subscribe(
        result => {
          this.submitted = false;

          if (result.response.sucessfull) {
            Materialize.toast('Se agrego nuevo usuario a ETAD!', 4000, 'green');
            this.router.navigate(['home/usuarios/sonarh']);

          } else {
            Materialize.toast(result.response.message, 4000, 'red');
          }
        }, error => {
          Materialize.toast('Ocrrió error en el servicio', 4000, 'red');
        }
      );
    }
    else {
      Materialize.toast('Verifique los datos capturados!', 4000, 'red');
    }


  }

  filtraLineas(id_etad: number): void {

    if (id_etad == undefined || id_etad == 0 || id_etad == 8 ) {
    
      let i = this.usuario.id_perfiles.indexOf(4);
      if (i != -1) {
        this.usuario.id_perfiles.splice(i, 1);
      }

      let j = this.usuario.id_perfiles.indexOf(5);
      if (j != -1) {
        this.usuario.id_perfiles.splice(j, 1);
      }

      $('#option4, #option5').removeAttr("selected");
      $('#option4, #option5').prop("disabled", true);

    } else {
      $('#option4, #option5').prop("disabled", false);

    }
   

    $('.perfi').material_select('destroy');
    $('.perfi').material_select();

    this.lineas = this.lineas_disponibles.filter(el => el.id_etad == id_etad);
    this.formPerfilSonarh.controls.id_linea.reset();


  }


}
