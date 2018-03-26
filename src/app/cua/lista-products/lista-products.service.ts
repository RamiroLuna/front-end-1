import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { Producto } from '../../models/producto';
import { BASE_URL_SERVICE } from '../../constants';

@Injectable()
export class ListaProductsService {

  private URL = BASE_URL_SERVICE + '/Productos';

  constructor(private http: HttpClient) { }

  getProductos(id_usuario: number): Observable<any> {
    return this.http.get<Producto>(this.URL + '?action=getAllDataCarProductos&id_usuario=' + id_usuario);
  }

  update(id_usuario: number, producto: Producto): Observable<any> {
    const body = new HttpParams()
      .set('action', 'updateCarProductos')
      .set('id_producto', '' + producto.id_producto)
      .set('id_linea', '' + producto.id_linea)
      .set('producto', ''+ producto.producto)
      .set('tipo_medida', ''+ producto.tipo_medida)
      .set('posicion', ''+ producto.posicion)
      .set('activo', ''+producto.activo)
      .set('id_usuario', "" + id_usuario);
    return this.http.post(this.URL, body);
  }

}
