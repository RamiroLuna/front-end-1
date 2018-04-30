import { Component, OnInit, AfterViewInit, EventEmitter } from '@angular/core';
import { PerfilService } from './perfil.service';
import { AuthService } from '../../auth/auth.service';
import { User } from '../../models/user';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';


declare var $: any;
declare var Materialize: any;

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  providers: [PerfilService]
})

export class PerfilComponent implements OnInit, AfterViewInit {

  public cambio_password: boolean;
  public usuario: User;
  public submitted: boolean;
  public contrasenia_nueva: string;
  public contrasenia_anterior: string;
  public confirmacion_nueva: string;
  public coincide: boolean;
  public formCambioPassword: FormGroup;
  public mensaje_error: string;
  public loading: boolean;


  constructor(
    private service: PerfilService,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router) {
    this.contrasenia_nueva;
    this.contrasenia_anterior;
    this.confirmacion_nueva;
    this.cambio_password = false;
    this.coincide = true;
  }

  ngOnInit() {
    this.loading = true;
    this.submitted = false;
    this.formCambioPassword = this.fb.group({
      contrasenia_nueva: new FormControl(this.contrasenia_nueva, [Validators.required]),
      confirmacion_nueva: new FormControl(this.confirmacion_nueva, [Validators.required]),
      contrasenia_anterior: new FormControl(this.contrasenia_anterior, [Validators.required])
    });

    this.route.params.subscribe(params => {
      if (this.auth.getIdUsuario() != null) {
        this.service.getPerfil(this.auth.getIdUsuario()).subscribe(result => {
          if (result.response.sucessfull) {
            this.usuario = result.data.usuario;
            this.loading = false;
          } else {
            Materialize.toast(result.response.message, 4000, 'red');
            this.loading = false;
          }
        }, error => {
          Materialize.toast('Ocurrió  un error en el servicio!', 4000, 'red');
          this.loading = false;
        }
        );
      }
    });



  }

  ngAfterViewInit() {
    $('#modal_cambio_password').modal({
      dismissible: false
    });

  }

  onChangePassword() {
    this.mensaje_error = "";
    this.confirmacion_nueva = null;
    this.contrasenia_anterior = null;
    this.contrasenia_nueva = null;
    this.cambio_password = !this.cambio_password;
    $('#modal_cambio_password').modal('open');
  }

  closeModal(event) {
    event.preventDefault();
    this.cambio_password = false;
    $('#modal_cambio_password').modal('close');
  }

  comprobarPassword() {

    if (this.contrasenia_nueva == this.confirmacion_nueva) {
      this.coincide = true;
    } else {
      this.coincide = false;

    }
  }

  changePassword() {
    // this.submitted = true;
    // if (this.formCambioPassword.valid) {
    //   this.service.postChangePasword(
    //     this.contrasenia_nueva,
    //     this.contrasenia_anterior,
    //     this.usuario.id_usuario
    //   ).subscribe(result => {
    //     this.submitted = false;
    //     this.formCambioPassword.reset();
    //     if (result.response.sucessfull) {
    //       this.cambio_password = false;
    //       Materialize.toast('Contraseña actualizada!', 4000, 'green');
    //       $('#modal_cambio_password').modal('close');
    //     } else {
    //       Materialize.toast(result.response.message, 4000, 'red');
    //     }
    //   });
    // }
    // else {
    //   Materialize.toast('Se encontrarón errores!', 4000, 'red');
    // }


  }

}
