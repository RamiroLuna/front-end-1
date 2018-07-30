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
    cargaMetaManual: false,
    cargaMasiva: false,
    edicionMeta: false,
    catalogos: false,
    indicador_diario: false,
    indicador_mensual: false,
    cargaPonderacionManual: false,
    cargaPonderacionMasiva: false,
    edicionPonderacion: false,
    configuracion_reporte: false,
    validacion:false
  }
  public loading: boolean;


  constructor(private auth: AuthService) { }

  ngOnInit() {
    this.loading = true;
  
    this.permission.cargaPonderacionMasiva = findRol(36, this.auth.getRolesEtad());   
    this.permission.cargaPonderacionManual = findRol(37, this.auth.getRolesEtad());   
    this.permission.edicionPonderacion = findRol(39, this.auth.getRolesEtad());
    this.permission.indicador_diario = findRol(43, this.auth.getRolesEtad());
    this.permission.indicador_mensual = findRol(47, this.auth.getRolesEtad());
    this.permission.validacion = findRol(52, this.auth.getRolesEtad());
    this.permission.configuracion_reporte = findRol(50, this.auth.getRolesEtad());

 

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
