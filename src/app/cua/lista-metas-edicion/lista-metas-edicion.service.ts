import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { Forecast } from '../../models/forecast';
import { BASE_URL_SERVICE } from '../../constants';

@Injectable()
export class ListaMetasEdicionService {

  private URL = BASE_URL_SERVICE + '/Metas';
  private URL_UPLOAD = BASE_URL_SERVICE + '/UploadFile';

  constructor(private http: HttpClient) { }

  /*
   * Consulta de catalogos
   */
  getInitCatalogos(idUsuario:number): Observable<any> {
    return this.http.get<any>(this.URL_UPLOAD + '?action=loadCombobox');
  }

  getAllMetas(id_usuario:number, idPeriodo:number, IdLinea:number): Observable<any>{
    const body = new HttpParams()
    .set('action', 'getAllMetas')
    .set('id_periodo', ""+idPeriodo)
    .set('id_linea', ""+IdLinea)
    .set('id_usuario', ""+id_usuario)
    return this.http.post<any>(this.URL,body);
  }

  delete(id_usuario: number, id_pro_meta: number): Observable<any> {
    const body = new HttpParams()
      .set('action', 'deleteAsignacionMeta')
      .set('id_pro_meta', '' + id_pro_meta)
      .set('id_usuario', '' + id_usuario)
    return this.http.post(this.URL, body);
  }

}
