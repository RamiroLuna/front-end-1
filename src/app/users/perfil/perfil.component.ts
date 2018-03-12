import { Component, OnInit, AfterViewInit, EventEmitter } from '@angular/core';
import { PerfilService } from './perfil.service';
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
  public id_perfil: number;
  public submitted: boolean;
  public contrasenia_nueva: string;
  public contrasenia_anterior: string;
  public confirmacion_nueva: string;
  public coincide: boolean;
  public formCambioPassword: FormGroup;
  public mensaje_error:string;


  constructor(
    private service: PerfilService,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private router: Router) {
    this.contrasenia_nueva;
    this.contrasenia_anterior;
    this.confirmacion_nueva;
    this.cambio_password = false;
    this.coincide = true;
  }

  ngOnInit() {
    this.submitted = false;
    this.formCambioPassword = this.fb.group({
      contrasenia_nueva: new FormControl(this.contrasenia_nueva, [Validators.required]),
      confirmacion_nueva: new FormControl(this.confirmacion_nueva, [Validators.required]),
      contrasenia_anterior: new FormControl(this.contrasenia_anterior, [Validators.required])
    });

    this.route.params.subscribe(params => {
      if (params['id'] != null) {
        this.service.getPerfil(params['id']).subscribe(result => {
          if (result.response.sucessfull) {
            this.usuario = result.data.usuario;
          } else {
            Materialize.toast(result.response.message, 4000, 'red');
          }
        });
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

  closeModal() {
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
    this.submitted = true;
    if (this.formCambioPassword.valid) {
      this.service.postChangePasword(
        this.contrasenia_nueva,
        this.contrasenia_anterior,
        this.usuario.id_usuario
      ).subscribe(result => {
        console.log('resultado del cambio de la contraseña', result);
        this.submitted = false;
        this.formCambioPassword.reset();
        if (result.response.sucessfull) {
          this.cambio_password = false;
          Materialize.toast('Contraseña actualizada!', 4000, 'green');
          $('#modal_cambio_password').modal('close');
        } else {
          Materialize.toast(result.response.message, 4000, 'red');
        }
      });
    }
    else {
      Materialize.toast('Se encontrarón errores!', 4000, 'red');
    }


  }

}
