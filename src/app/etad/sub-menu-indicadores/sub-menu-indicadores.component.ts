import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

declare var $: any;
declare var Materialize: any;

@Component({
  selector: 'app-sub-menu-indicadores',
  templateUrl: './sub-menu-indicadores.component.html'
})
export class SubMenuIndicadoresComponent implements OnInit {

  public seccion: string;
  public loading: boolean;

  constructor(
    private route: ActivatedRoute,
    private router: Router) { }

  ngOnInit() {

    this.loading = true;
    this.seccion = "";
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
