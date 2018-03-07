import { Component, OnInit } from '@angular/core';
import { LoginService } from './login.service';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';

declare var Materialize: any;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styles: [],
  providers: [LoginService]
})
export class LoginComponent implements OnInit {

  public accesos: Array<any> = [
    { id: 1, descripcion: 'ETAD' },
    { id: 2, descripcion: 'ACOPIO' }
  ];

  public formLogin: FormGroup;
  public submitted: boolean;

  public datos: any = {
    usuario_acceso: "",
    clave_accesso: "",
    id_sistemas: 0
  };





  constructor(private service: LoginService, private fb: FormBuilder) { }

  ngOnInit() {
    this.submitted = false;
    this.formLogin = this.fb.group({
      usuario_acceso: new FormControl(this.datos.usuario_acceso, [Validators.required]),
      clave_accesso: new FormControl(this.datos.clave_accesso, [Validators.required]),
      id_sistemas: new FormControl(this.datos.id_sistemas, [Validators.required])
    });
  }


  login(param: any) {
    this.submitted = true;
    if (this.formLogin.valid) {
      console.log('Inicio de sesion',param, this.formLogin)
    }else{
      Materialize.toast('Se encontrarón errores!', 4000, 'red');
    }
  }



}
