import { Component, OnInit } from '@angular/core';
import { UserSonarh } from '../../models/user-sonarh';
import { ListaValidacionService } from './lista-validacion.service';
import { AuthService } from '../../auth/auth.service';
import { DataTable , findRol } from '../../utils';

declare var $: any;
declare var Materialize: any;

@Component({
  selector: 'app-lista-validacion',
  templateUrl: './lista-validacion.component.html',
  providers: [ListaValidacionService]
})
export class ListaValidacionComponent implements OnInit {


  public loading: boolean;
  public permission: any = {
  };

  constructor(
    private service: ListaValidacionService,
    private auth: AuthService) { }

  ngOnInit() {
    this.loading = true;
    // this.permission.altaEtad = findRol(11,this.auth.getRolesGenerales());
    // this.permission.showListEtad = findRol(14,this.auth.getRolesGenerales());
    this.service.getProducuccionForLiberar(this.auth.getIdUsuario()).subscribe(result => {
      if (result.response.sucessfull) {
        //this.usuarios_sonarh = result.data.listUserSonarh || [];
        this.loading = false;
        setTimeout(() => { this.ngAfterViewHttp() }, 200)
      } else {
        Materialize.toast('Ocurrió  un error al consultar usuarios en SONARH!', 4000, 'red');
        this.loading = false;
      }
    }, error => {
      Materialize.toast('Ocurrió  un error en el servicio!', 4000, 'red');
      this.loading = false;
    });

  }

    /*
   * Carga plugins despues de cargar y mostrar objetos en el DOM
   */
  ngAfterViewHttp(): void {

    DataTable('#tabla');

    $('.tooltipped').tooltip({ delay: 50 });
  }


  ocultarTooltip() {
    $('.tooltipped').tooltip('hide');
  }

}
