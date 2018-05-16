import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { Periodo } from '../../models/periodo';
import { BASE_URL_SERVICE } from '../../constants';

@Injectable()
export class ListaPeriodosService {

  private URL = BASE_URL_SERVICE + '/Periodos';

  constructor(private http: HttpClient) { }

  /*
   * Consulta de catalogos
   */
  getInit(idUsuario: number): Observable<any> {
    return this.http.get<any>(this.URL + '?action=getAllPeriodos&id_usuario=' + idUsuario);
  }

  closePeriodo(id_usuario: number,  id_periodo: number): Observable<any> {
    const body = new HttpParams()
      .set('action', 'closePeriodo')
      .set('id_periodo', '' + id_periodo)
      .set('id_usuario', '' + id_usuario)
    return this.http.post(this.URL, body);
  }

  reOpenPeriodo(id_usuario: number,  id_periodo: number ): Observable<any> {
    const body = new HttpParams()
      .set('action', 'reOpenPeriodo')
      .set('id_periodo', '' + id_periodo)
      .set('id_usuario', '' + id_usuario)
    return this.http.post(this.URL, body);
  }

}
