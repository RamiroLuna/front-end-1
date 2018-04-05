import { Component, OnInit, AfterViewInit } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { Router } from '@angular/router';
import { User } from '../models/user';


declare var $: any;
declare var Materialize: any;
@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html'
})
export class MenuComponent implements OnInit, AfterViewInit {
  public session: User;
  public perfil: number;
  public id_usuario: number;

  constructor(private router: Router, private auth: AuthService) { }

  ngOnInit() {
    this.perfil = this.auth.getPerfil();
    this.id_usuario = this.auth.getIdUsuario();
    try {
      if (localStorage.datos_usuario) {
        this.session = JSON.parse(localStorage.getItem('datos_usuario'));
      }
    } catch (e) {
      this.session = new User();
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
