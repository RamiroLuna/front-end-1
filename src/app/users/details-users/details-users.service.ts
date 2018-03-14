import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { BASE_URL_SERVICE } from '../../constants';
import { UserSonarh } from '../../models/user-sonarh';
import { Catalogo } from '../../models/catalogo';

@Injectable()
export class DetailsUsersService {

  private URL = BASE_URL_SERVICE + '/Users';
  private URL_CATALOGOS = BASE_URL_SERVICE + '/Catalogos';

  constructor(private http: HttpClient) { }

  getCatalogo(id_usuario: number, tableName: string): Observable<any> {
    return this.http.get<Catalogo>(this.URL_CATALOGOS + '?action=getCatalogosData&tableName=' + tableName + '&id_usuario=' + id_usuario);
  }

  getDetalleUsuarioSonarh(id_usuario: number, id_usuario_sonarh: number): Observable<any> {
    return this.http.get<UserSonarh>(this.URL + '?action=getPerfilSonarh&id_usuario=' + id_usuario + '&id_usuario_sonarh=' + id_usuario_sonarh);
  }

  altaUsuario(id_usuario:number, usuario:UserSonarh): Observable<any>{
    const body = new HttpParams()
    .set('action', 'insertUsers')
    .set('nombre', usuario.nombre_completo)
    .set('id_sonarh', ''+usuario.id_sonarh)
    .set('id_linea', ''+usuario.id_linea)
    .set('id_grupo', ''+usuario.id_grupo)
    .set('id_perfil', ''+usuario.id_perfil)
    .set('id_turno', ''+usuario.id_turno)
    .set('usuario_acceso', usuario.usuario_acceso)
    .set('id_usuario', ""+id_usuario);
    return this.http.post(this.URL,body);
  }

}
