import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { BASE_URL_SERVICE } from '../constants';
import { Catalogo } from '../models/catalogo';

@Injectable()
export class SecurityService {

  private URL = BASE_URL_SERVICE + '/Catalogos';

  constructor(private http: HttpClient) { }

  /* 
   * Consulta los perfiles que existen en el sistema
   */
  getAllCatalogos(id_usuario: number): Observable<any> {
    return this.http.get<any>(this.URL + '?action=getCatalogosData&tableName=pet_cat_perfil&id_usuario=' + id_usuario);
  }

  /* 
   * Consulta los perfiles que existen en el sistema
   */
  getRolesByPerfil(id_usuario: number,id_perfil:string): Observable<any> {
    return this.http.get<any>(this.URL + '?action=getRolesByPerfil&id_perfil='+id_perfil+'&id_usuario=' + id_usuario);
  }

}
