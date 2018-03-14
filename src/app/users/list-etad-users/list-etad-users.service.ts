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

  update(id_usuario: number, usuario: User): Observable<any> {
    const body = new HttpParams()
      .set('action', 'updatePerfil')
      .set('id_usuario_modificar', "" + usuario.id_usuario)
      .set('id_perfil', "" + usuario.id_perfil)
      .set('id_turno', ""+usuario.id_turno)
      .set('activo', ""+usuario.activo)
      .set('id_usuario', "" + id_usuario);
    return this.http.post(this.URL, body);
  }

  delete(id_usuario: number, id_usuario_delete: number): Observable<any> {
    const body = new HttpParams()
      .set('action', 'deleteUser')
      .set('id_usuario_delete', '' + id_usuario_delete)
      .set('id_usuario', '' + id_usuario)
    return this.http.post(this.URL, body);
  }

}
