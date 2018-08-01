import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { BASE_URL_SERVICE } from '../constants';

@Injectable()
export class CatalogosGeneralesService {

  private URL = BASE_URL_SERVICE + '/Catalogos';

  constructor(private http: HttpClient) { }

  /* 
   * Retorna todos los elementos registrados en el catalogo
   */
  getAllCatalogos(id_usuario: number, table_name: string): Observable<any> {
    return this.http.get<any>(this.URL + '?action=getCatalogosData&tableName=' + table_name + '&id_usuario=' + id_usuario);
  }

}
