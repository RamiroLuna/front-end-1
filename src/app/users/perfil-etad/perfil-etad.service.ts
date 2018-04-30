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
    // .set('action', 'updatePerfil')
    // .set('id_usuario_modificar', ''+usuario.id_usuario)
    // .set('id_perfil', ''+usuario.id_perfil)
    // .set('id_turno', ''+usuario.id_turno)
    // .set('activo', ''+usuario.activo)
    // .set('id_usuario', ""+id_usuario);
    return this.http.post(this.URL,body);
  }



}
