import { Component, AfterViewInit } from '@angular/core';
import { AuthService } from '../../auth/auth.service';
import { findRol } from '../../utils';
declare var $: any;
@Component({
  selector: 'app-options',
  templateUrl: './options.component.html'
})
export class OptionsComponent implements AfterViewInit {

  public permission: any = {
    abrirPeriodo: false,
    consultarPeriodos: false,
    cargaMetaManual: false,
    cargaMasiva: false,
    edicionMeta: false,
    produccion: false,
    fallas: false,
    validacion: false,
    catalogos: false
  }
  public loading: boolean;


  constructor(private auth: AuthService) { }

  ngOnInit() {
    this.loading = true;
    
    this.permission.abrirPeriodo = findRol(23, this.auth.getRolesCUA());
    this.permission.consultarPeriodos = findRol(25, this.auth.getRolesCUA());
    this.permission.cargaMetaManual = findRol(2, this.auth.getRolesCUA());
    this.permission.cargaMasiva = findRol(1, this.auth.getRolesCUA());
    this.permission.edicionMeta = findRol(3, this.auth.getRolesCUA());
    this.permission.fallas = findRol(7, this.auth.getRolesCUA());
    this.permission.produccion = findRol(18, this.auth.getRolesCUA());
    this.permission.validacion = findRol(20, this.auth.getRolesCUA());
    this.permission.catalogos = findRol(22, this.auth.getRolesCUA());
    this.loading = false;
    setTimeout(() => {
     
      $('.tooltipped').tooltip({ delay: 50 });
      $('.collapsible').collapsible();
    }, 20)

  }

  ngAfterViewInit() {

  }

  ocultarTooltip() {
    $('.tooltipped').tooltip('hide');
  }

  regresar() {
    $('.tooltipped').tooltip('hide');
  }

}
