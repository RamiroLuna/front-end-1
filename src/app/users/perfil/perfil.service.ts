import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { BASE_URL_SERVICE } from '../../constants';
import { User } from '../../models/user';

@Injectable()
export class PerfilService {

  private URL = BASE_URL_SERVICE + '/Users';

  constructor(private http: HttpClient) { }

  getPerfil(id_usuario:number):Observable<any>{
     return this.http.get<User>(this.URL + '?action=getPerfil&id_usuario='+id_usuario);
  }

  postChangePasword(contrasenia_nueva:string, contrasenia_anterior:string, id_usuario:number): Observable<any>{
    
    const body = new HttpParams()
    .set('action', 'changePassword')
    .set('contraseniaNueva', contrasenia_nueva)
    .set('contraseniaAnterior', contrasenia_anterior)
    .set('id_usuario', ""+id_usuario);
    return this.http.post(this.URL,body);
  }

}
