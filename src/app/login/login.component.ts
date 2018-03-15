import { Component, OnInit } from '@angular/core';
import { LoginService } from './login.service';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { User } from '../models/user';

declare var Materialize: any;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  providers: [LoginService]
})
export class LoginComponent implements OnInit {

  public accesos: Array<any> = [
    { id: 1, descripcion: 'RECICLADO' }
    //{ id: 2, descripcion: 'ACOPIO' }
  ];

  public formLogin: FormGroup;
  public submitted: boolean;
  public usuario_acceso: string;
  public clave_acceso: string;
  public id_sistemas: number = 1;
  public mensaje_error: string;
  public disabled: boolean;
  public usuario: User;


  constructor(private service: LoginService,
    private fb: FormBuilder,
    private router: Router) { }

  ngOnInit() {
    this.mensaje_error = "";
    this.submitted = false;
    this.disabled = false;
    this.formLogin = this.fb.group({
      usuario_acceso: new FormControl(this.usuario_acceso, [Validators.required]),
      clave_acceso: new FormControl(this.clave_acceso, [Validators.required]),
      id_sistemas: new FormControl(this.id_sistemas, [Validators.required])
    });
  }


  login() {
    this.mensaje_error = "";
    this.submitted = true;

    if (this.formLogin.valid) {
      this.disabled = true;
      this.service.login(this.usuario_acceso, this.clave_acceso, this.id_sistemas).subscribe(result => {


        if (result.response.sucessfull) {
          if (typeof (Storage) !== "undefined") {
            this.usuario = result.response.usuario;
            localStorage.setItem('token', this.usuario.token);
            localStorage.setItem('datos_usuario', JSON.stringify(this.usuario));
            this.router.navigate(['home']);
          } else {
            Materialize.toast('LocalStorage no soportado en este navegador!', 4000, 'red');
          }
        } else {

          this.mensaje_error = result.response.message;
          Materialize.toast('Error al ingresar!', 4000, 'red');
        }
        this.disabled = false;
      }, error =>{
        this.disabled = false;
        Materialize.toast('Ocurrió  un error en el servicio!', 4000, 'red');
      });

    } else {
      Materialize.toast('Se encontrarón errores!', 4000, 'red');
    }

  }

  resetMensaje() {
    this.mensaje_error = "";
  }



}
