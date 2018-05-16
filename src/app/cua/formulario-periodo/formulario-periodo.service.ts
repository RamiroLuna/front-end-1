import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { BASE_URL_SERVICE } from '../../constants';

@Injectable()
export class FormularioPeriodoService {

  private URL = BASE_URL_SERVICE + '/Periodos';

  constructor(private http: HttpClient) { }

  /*
   * Consulta el siguiente periodo disponible y regresa las lineas
   */
  getInit(idUsuario:number): Observable<any> {
    return this.http.get<any>(this.URL + '?action=openPeriodo&id_usuario='+idUsuario);
  }

  abrir(id_usuario: number, metas_esperadas:any, periodo:any): Observable<any> {
    const body = new HttpParams()
      .set('action', 'saveDetailsPeriodo')
      .set('anio', ''+periodo.anio)
      .set('mes', ''+periodo.mes)
      .set('metas_esperadas', ''+ JSON.stringify(metas_esperadas))
      .set('id_usuario', '' + id_usuario)

    return this.http.post(this.URL, body);
  }

  /*
   * Consulta por id_perido
   */
  getDetailsByPeriodo(idUsuario: number,id_periodo:number): Observable<any> {
    return this.http.get<any>(this.URL + '?action=getDetailsByPeriodo&id_usuario=' + idUsuario + '&id_periodo='+id_periodo);
  }

  update(id_usuario: number, metas_esperadas:any): Observable<any> {
    const body = new HttpParams()
      .set('action', 'updateDetailsPeriodo')
      .set('metas_esperadas', ''+ JSON.stringify(metas_esperadas))
      .set('id_usuario', '' + id_usuario)

    return this.http.post(this.URL, body);
  }

}
