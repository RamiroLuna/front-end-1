import { Component, OnInit, AfterViewInit } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { getFechaActual } from '../utils';
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
  public menu_cua: boolean;
  public menu_etad: boolean;
  public menu_ishikawa: boolean;
  public menu_generales: boolean;
  public consultaSonarh: boolean;
  public consultaEtad: boolean;
  public id_usuario: number;
  public fecha:string;

  constructor(private router: Router, private auth: AuthService) { }

  ngOnInit() {
    this.consultaSonarh =  false;
    this.consultaEtad = false;
    this.menu_cua= false;
    this.menu_etad= false;
    this.menu_ishikawa= false;
    this.menu_generales= false;
    this.fecha = getFechaActual();

    /* Si no puede ver el menu trae un "0" en la primer posicion del conjunto de roles */
    this.menu_cua = !(this.auth.getRolesOee().split(",")[0] == "0");
    this.menu_etad = !(this.auth.getRolesEtad().split(",")[0] == "0");
    this.menu_ishikawa = !(this.auth.getRolesIshikawa().split(",")[0] == "0");
    
    let tmpRolesGral = this.auth.getRolesGenerales().split(",").map(el=>parseInt(el));

    /* 10 al rol de consulta de usuario */
    if(tmpRolesGral.includes(10)){
      this.menu_generales = true;
      this.consultaSonarh = true;
    }

    /* 14 al rol de consulta de usuario */
    if(tmpRolesGral.includes(14)){
      this.menu_generales = true;
      this.consultaEtad = true;
    }
   
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
