import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { BASE_URL_SERVICE } from '../../constants';

@Injectable()
export class ListByCatalogService {

  private URL = BASE_URL_SERVICE + '/EtadCatalogos';

  constructor(private http: HttpClient) { }

  /* 
   * Retorna todos los elementos registrados en el catalogo
   */
  getAllCatalogos(id_usuario: number, tipo_catalogo: number): Observable<any> {
    return this.http.get<any>(this.URL + '?action=getAllCatalogos&tipo_catalogo=' + tipo_catalogo + '&id_usuario=' + id_usuario);
  }


}
