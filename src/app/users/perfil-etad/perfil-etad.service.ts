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

  getPerfilEtad(id_usuario:number, id_acceso:number):Observable<any>{
     return this.http.get<User>(this.URL + '?action=getUserETADByID&id_usuario='+id_usuario+'&id_acceso='+id_acceso);
  }

  update(id_usuario:number, usuario:User): Observable<any>{
    const body = new HttpParams()
    .set('action', 'updateUserETAD')
    .set('id_acceso', ''+usuario.id_acceso)
    .set('id_grupo', ''+usuario.id_grupo)
    .set('id_etad', ''+usuario.id_etad)
    .set('id_linea', ''+usuario.id_linea)
    .set('perfiles', ''+usuario.id_perfiles)
    .set('id_usuario', ""+id_usuario);
    return this.http.post(this.URL,body);
  }



}
