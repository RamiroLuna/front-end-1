import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { MetaAsignacion } from '../../models/meta-asignacion';
import { BASE_URL_SERVICE } from '../../constants';

@Injectable()
export class ListaMetasEdicionService {

  private URL = BASE_URL_SERVICE + '/Metas';

  constructor(private http: HttpClient) { }

  getAllAsignacionesByYear(id_usuario:number,year:number): Observable<any> {
    return this.http.get<MetaAsignacion>(this.URL + '?action=getAllAsignacionesByYear&year='+year+'&id_usuario='+id_usuario);
  }

  delete(id_usuario: number, id_pro_meta: number): Observable<any> {
    const body = new HttpParams()
      .set('action', 'deleteAsignacionMeta')
      .set('id_pro_meta', '' + id_pro_meta)
      .set('id_usuario', '' + id_usuario)
    return this.http.post(this.URL, body);
  }

}
