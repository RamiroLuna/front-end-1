import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { BASE_URL_SERVICE } from '../../constants';
import { Producto } from '../../models/producto';

@Injectable()
export class FormularioProductoService {
  /* 
   * URL del servicio del componente
   */ 

  private URL = BASE_URL_SERVICE + '/Productos';

  constructor(private http: HttpClient) { }

    /*
   * Bloque de codigo para peticiones de catalogos genericos
   */
  agregar(id_usuario: number, producto: Producto): Observable<any> {
    const body = new HttpParams()
      .set('action', 'insertNewMetaCatalog')
      .set('', '')
      .set('id_usuario', '' + id_usuario);
    return this.http.post(this.URL, body);
  }

  update(id_usuario: number,  producto: Producto): Observable<any> {
    const body = new HttpParams()
      .set('action', 'updateNewMetaCatalog')
      .set('', '')
      .set('id_usuario', "" + id_usuario);
    return this.http.post(this.URL, body);
  }
}
