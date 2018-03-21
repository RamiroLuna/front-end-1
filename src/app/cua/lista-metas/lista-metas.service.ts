import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { Meta } from '../../models/meta';
import { BASE_URL_SERVICE } from '../../constants';


@Injectable()
export class ListaMetasService {

  private URL = BASE_URL_SERVICE + '/Metas';

  constructor(private http: HttpClient) { }

  getMetas(id_usuario:number): Observable<any> {
    return this.http.get<Meta>(this.URL + '?action=getDataMetasCatalog&id_usuario='+id_usuario);
  }

  update(id_usuario: number, meta: Meta): Observable<any> {
    const body = new HttpParams()
      .set('action', 'updateNewMetaCatalog')
      .set('idMeta', '' + meta.id_meta)
      .set('idLinea', ''+ meta.id_linea)
      .set('activo', '' + meta.activo)
      .set('posicion', '' + meta.posicion)
      .set('meta', '' + meta.meta)
      .set('tipoMedida', '' +  meta.tipo_medida)
      .set('id_usuario', "" + id_usuario);
    return this.http.post(this.URL, body);
  }

  delete(id_usuario: number, id_meta: number): Observable<any> {
    const body = new HttpParams()
      .set('action', 'deleteNewMetaCatalog')
      .set('idMeta', ''+id_meta)
      .set('id_usuario', '' + id_usuario)
    return this.http.post(this.URL, body);
  }

}
