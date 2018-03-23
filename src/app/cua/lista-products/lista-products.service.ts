import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { Producto } from '../../models/producto';
import { BASE_URL_SERVICE } from '../../constants';

@Injectable()
export class ListaProductsService {

  private URL = BASE_URL_SERVICE + '/Producto';

  constructor(private http: HttpClient) { }

  getProductos(id_usuario: number): Observable<any> {
    return this.http.get<Producto>(this.URL + '?action=getProductos&id_usuario=' + id_usuario);
  }

  update(id_usuario: number, producto: Producto): Observable<any> {
    const body = new HttpParams()
      .set('action', 'updateNewMetaCatalog')
      .set('', '')
      .set('id_usuario', "" + id_usuario);
    return this.http.post(this.URL, body);
  }


}
