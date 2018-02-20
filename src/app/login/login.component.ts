import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styles: []
})
export class LoginComponent implements OnInit {
  public accesos:Array<any> = [
    {id: '1', descripcion: 'ACOPIO'},
    {id: '2', descripcion: 'ETAD'}
  ];

  constructor() { }

  ngOnInit() {
  }

}
