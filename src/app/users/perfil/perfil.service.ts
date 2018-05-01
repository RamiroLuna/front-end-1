import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { BASE_URL_SERVICE } from '../../constants';
import { User } from '../../models/user';

@Injectable()
export class PerfilService {

  private URL = BASE_URL_SERVICE + '/Users';

  constructor(private http: HttpClient) { }

  miPerfil(id_acceso:number):Observable<any>{
     return this.http.get<User>(this.URL + '?action=miPerfil&id_usuario='+id_acceso);
  }

}
