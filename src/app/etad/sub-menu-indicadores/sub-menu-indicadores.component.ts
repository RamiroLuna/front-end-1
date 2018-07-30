import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { findRol } from '../../utils';
import { AuthService } from '../../auth/auth.service';

declare var $: any;
declare var Materialize: any;

@Component({
  selector: 'app-sub-menu-indicadores',
  templateUrl: './sub-menu-indicadores.component.html'
})
export class SubMenuIndicadoresComponent implements OnInit {

  public seccion: string;
  public loading: boolean;


  public permission: any = {
    consulta_edicion_diario: false,
    registro_diario: false,
    consulta_edicion_mensual: false,
    registro_mensual: false
  }

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private auth: AuthService) { }

  ngOnInit() {

    this.loading = true;
    this.seccion = "";
    this.permission.consulta_edicion_diario = findRol(43, this.auth.getRolesEtad());   
    this.permission.registro_diario = findRol(41, this.auth.getRolesEtad());   
    this.permission.consulta_edicion_mensual = findRol(47, this.auth.getRolesEtad());   
    this.permission.registro_mensual = findRol(45, this.auth.getRolesEtad());   

    this.route.paramMap.subscribe(params => {
      this.seccion = params.get('seccion');
      this.loading = false;

    });

    setTimeout(() => this.ngAfterViewHttp(), 20);
  }

  regresar() {
    $('.tooltipped').tooltip('hide');
  }

  /*
   * Carga plugins 
   */
  ngAfterViewHttp(): void {
    $('.tooltipped').tooltip({ delay: 50 });
  }

}
