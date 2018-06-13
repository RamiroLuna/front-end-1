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
    catalogos: false
  }
  public loading: boolean;


  constructor(private auth: AuthService) { }

  ngOnInit() {
    this.loading = true;
  
    this.permission.cargaMasiva = findRol(28, this.auth.getRolesEtad());   

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
