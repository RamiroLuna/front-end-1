import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { UserSonarh } from '../../models/user-sonarh';
import { BASE_URL_SERVICE } from '../../constants';


@Injectable()
export class ListSonarhUsersService {
  private URL = BASE_URL_SERVICE + '/Users';

  constructor(private http: HttpClient) { }

  getSonarhUsuarios(id_usuario:number): Observable<any> {
    return this.http.get<UserSonarh>(this.URL + '?action=getUsersSonarh&id_usuario='+id_usuario);
  }

}
