import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { BASE_URL_SERVICE } from '../../constants';
import { Catalogo } from '../../models/catalogo';

@Injectable()
export class ListByCatalogService {

  private URL = BASE_URL_SERVICE + '/Catalogos';

  constructor(private http: HttpClient) { }

  getElementsByCatalog(id_usuario: number, tableName: string): Observable<any> {
    return this.http.get<Catalogo>(this.URL + '?action=getCatalogosData&tableName=' + tableName + '&id_usuario=' + id_usuario);
  }

  update(id_usuario: number, tableName: string, catalogo: Catalogo): Observable<any> {
    const body = new HttpParams()
      .set('action', 'updateCatalogo')
      .set('tableName', tableName)
      .set('idCatalogo', "" + catalogo.id)
      .set('activoCatalogo', "" + catalogo.activo)
      .set('descripcion', catalogo.descripcion)
      .set('id_usuario', "" + id_usuario);
    return this.http.post(this.URL, body);
  }

  delete(id_usuario: number, tableName: string, id_catalogo: number): Observable<any> {
    const body = new HttpParams()
      .set('action', 'deleteCatalogo')
      .set('tableName', '' + tableName)
      .set('idCatalogo', '' + id_catalogo)
      .set('id_usuario', '' + id_usuario)
    return this.http.post(this.URL, body);
  }

}
