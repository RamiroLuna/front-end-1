import { Component, OnInit } from '@angular/core';
import { LoginService } from './login.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styles: [],
  providers: [LoginService]
})
export class LoginComponent implements OnInit {
  public accesos: Array<any> = [
    { id: '1', descripcion: 'ACOPIO' },
    { id: '2', descripcion: 'ETAD' }
  ];



  constructor(private service: LoginService) { }

  ngOnInit() {
    console.log('ejecuta');
   this.service.getAll().subscribe(res =>{ console.log(res)});
  }



}
