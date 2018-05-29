import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { BASE_URL_SERVICE } from '../../constants';

@Injectable()
export class ListaValidacionService {

  private URL = BASE_URL_SERVICE + '/Produccion';

  constructor(private http: HttpClient) { }

  getProducuccionForLiberar(id_usuario: number): Observable<any> {
    return this.http.get<any>(this.URL + '?action=getProducuccionForLiberar&id_usuario=' + id_usuario);
  }



}
