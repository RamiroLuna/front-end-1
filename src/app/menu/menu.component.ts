import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '../models/user';

declare var $: any;
declare var Materialize: any;
@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styles: []
})
export class MenuComponent implements OnInit, AfterViewInit {

  public sesion: User;

  constructor(private router: Router) { }

  ngOnInit() {
    try {
      if (localStorage.datos_usuario) {
        this.sesion = JSON.parse(localStorage.getItem('datos_usuario'));
      }
    } catch (e) {
       this.sesion = new User();
       Materialize.toast('Error al obtener datos de sesión!', 4000, 'red');
     }


  }
  ngAfterViewInit() {
    $('.collapsible').collapsible();

  }

  logout(event) {

    try {
      if (localStorage.datos_usuario) {
        localStorage.removeItem('datos_usuario');
      }
    } catch (e) { }

    try {
      if (localStorage.token) {
        localStorage.removeItem('token');
      }
    } catch (e) {
      Materialize.toast('No se pudo cerrar sesión!', 4000, 'red');
    }
    this.router.navigate(['login']);
    event.preventDefault();
  }

}
