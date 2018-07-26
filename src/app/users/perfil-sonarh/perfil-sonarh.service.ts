import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { BASE_URL_SERVICE } from '../../constants';
import { UserSonarh } from '../../models/user-sonarh';
import { Catalogo } from '../../models/catalogo';

@Injectable()
export class PerfilSonarhService {

  private URL = BASE_URL_SERVICE + '/Users';
  private URL_CATALOGOS = BASE_URL_SERVICE + '/Catalogos';

  constructor(private http: HttpClient) { }


  getDetalleUsuarioSonarh(id_usuario: number, numero_empleado: number): Observable<any> {
    return this.http.get<UserSonarh>(this.URL + '?action=getPerfilSonarh&id_usuario=' + id_usuario + '&numero_empleado=' + numero_empleado);
  }

  altaUsuario(id_usuario:number, usuario:UserSonarh): Observable<any>{
    const body = new HttpParams()
    .set('action', 'insertUserETAD')
    .set('numero_empleado', ''+usuario.NumEmpleado)
    .set('id_linea', ''+usuario.id_linea)
    .set('id_grupo', ''+usuario.id_grupo)
    .set('id_etad', ''+usuario.id_etad)
    .set('perfiles', ''+usuario.id_perfiles)
    .set('id_usuario', ""+id_usuario);
    return this.http.post(this.URL,body);
  }

}
