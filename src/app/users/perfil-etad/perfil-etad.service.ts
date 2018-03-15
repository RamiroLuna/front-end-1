import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { BASE_URL_SERVICE } from '../../constants';
import { User } from '../../models/user';
import { Catalogo } from '../../models/catalogo';

@Injectable()
export class PerfilEtadService {

  private URL = BASE_URL_SERVICE + '/Users';
  private URL_CATALOGOS = BASE_URL_SERVICE + '/Catalogos';

  constructor(private http: HttpClient) { }


  getCatalogo(id_usuario: number, tableName: string): Observable<any> {
    return this.http.get<Catalogo>(this.URL_CATALOGOS + '?action=getCatalogosData&tableName=' + tableName + '&id_usuario=' + id_usuario);
  }

  getPerfilEtad(id_usuario:number, id_usuario_buscar:number):Observable<any>{
     return this.http.get<User>(this.URL + '?action=getPerfilEtad&id_usuario='+id_usuario+'&id_usuario_buscar='+id_usuario_buscar);
  }


}
