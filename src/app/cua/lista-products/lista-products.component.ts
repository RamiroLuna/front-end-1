import { Component, OnInit, AfterViewInit } from '@angular/core';
import { AuthService } from '../../auth/auth.service';
import { ListaProductsService } from './lista-products.service';
import { Producto } from '../../models/producto';

declare var $: any;
declare var Materialize: any;
@Component({
  selector: 'app-lista-products',
  templateUrl: './lista-products.component.html',
  providers: [ ListaProductsService ]
})
export class ListaProductsComponent  implements OnInit, AfterViewInit {
  public loading: boolean;
  public mensajeModal: string;
  public productos: Array<Producto>;

  constructor(
    private auth: AuthService,
    private service: ListaProductsService
  ) { }

  ngOnInit() {
    this.loading = true;
    this.service.getProductos(this.auth.getIdUsuario()).subscribe(result => {
      if (result.response.sucessfull) {
        this.productos = result.data.listMetas || [];
        this.loading = false;
      } else {
        Materialize.toast('Ocurrió  un error al consultar las metas!', 4000, 'red');
        this.loading = false;
      }
    }, error => {
      Materialize.toast('Ocurrió  un error en el servicio!', 4000, 'red');
      this.loading = false;
    });
  }

  ngAfterViewInit(): void {
    $('.tooltipped').tooltip({ delay: 50 });
  }

  agregar() {
    $('.tooltipped').tooltip('hide');
  }

  regresar() {
    $('.tooltipped').tooltip('hide');
  }

}
