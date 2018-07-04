import { Component, OnInit } from '@angular/core';

declare var $: any;
declare var Materialize: any;
@Component({
  selector: 'app-sub-menu-ponderaciones',
  templateUrl: './sub-menu-ponderaciones.component.html',
  styles: []
})
export class SubMenuPonderacionesComponent implements OnInit {

  constructor() { }

  ngOnInit() {
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
