import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { User } from '../../models/user';
import { BASE_URL_SERVICE } from '../../constants';

@Injectable()
export class ListEtadUsersService {
  private URL = BASE_URL_SERVICE + '/Users';

  constructor(private http: HttpClient) { }

  getEtadUsuarios(id_usuario:number): Observable<any> {
    return this.http.get<User>(this.URL + '?action=getUsersETAD&id_usuario='+id_usuario);
  }

  update(id_usuario: number,  id_acceso: number, activo:number): Observable<any> {
    const body = new HttpParams()
      .set('action', 'deleteUserETAD')
      .set('id_acceso', '' + id_acceso)
      .set('activo', '' + activo)
      .set('id_usuario', '' + id_usuario)
    return this.http.post(this.URL, body);
  }

}
