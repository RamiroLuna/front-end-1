import { Component, OnInit } from '@angular/core';
import { UserSonarh } from '../../models/user-sonarh';
import { ListaValidacionService } from './lista-validacion.service';
import { AuthService } from '../../auth/auth.service';
import { DataTable, findRol } from '../../utils';
import { Produccion } from '../../models/produccion';

declare var $: any;
declare var Materialize: any;

@Component({
  selector: 'app-lista-validacion',
  templateUrl: './lista-validacion.component.html',
  providers: [ListaValidacionService]
})
export class ListaValidacionComponent implements OnInit {


  public loading: boolean;
  public height: number;
  public listaProduccion: Array<Produccion>;
  public permission: any = {
  };

  constructor(
    private service: ListaValidacionService,
    private auth: AuthService) { }

  ngOnInit() {

    this.loading = true;
    this.listaProduccion = [];

    this.service.getProducuccionForLiberar(this.auth.getIdUsuario()).subscribe(result => {

      if (result.response.sucessfull) {
        this.listaProduccion = result.data.listProduccion || [];
        this.loading = false;
        setTimeout(() => { this.ngAfterViewHttp() }, 200)
      } else {
        Materialize.toast('Ocurrió  un error al consultar producciones pendientes!', 4000, 'red');
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
