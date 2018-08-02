import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SecurityService } from './security.service';
import { AuthService } from '../auth/auth.service';
import { deleteItemArray } from '../utils';
import swal from 'sweetalert2';
import { Catalogo } from '../models/catalogo';

declare var $: any;
declare var Materialize: any;
@Component({
  selector: 'app-security',
  templateUrl: './security.component.html',
  providers: [ SecurityService ]
})
export class SecurityComponent implements OnInit {

  public perfiles: Array<Catalogo>;
  public loading: boolean;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private service: SecurityService,
    private auth: AuthService
  ) { }

  ngOnInit() {

    this.loading = true;
    
    this.service.getAllCatalogos(this.auth.getIdUsuario()).subscribe(result => {
     
      if (result.response.sucessfull) {
        this.perfiles = result.data.listCatalogosDTO || [];
        this.loading = false;
        setTimeout(() => { this.ngAfterViewHttp(); }, 200)
      } else {

        this.loading = false;
        Materialize.toast(result.response.message, 4000, 'red');
      }
    }, error => {

      this.loading = false;
      Materialize.toast('Ocurrió un error en el servicio!', 4000, 'red');
    });

  }

  /*
  * Carga plugins despues de cargar y mostrar objetos en el DOM
  */
  ngAfterViewHttp(): void {
    $('.tooltipped').tooltip({ delay: 50 });
  }

  /*
  * Inicia codigo para la funcionalidad del componente
  */

  agregar() {
    $('.tooltipped').tooltip('hide');
  }

  regresar() {
    $('.tooltipped').tooltip('hide');
  }

}
