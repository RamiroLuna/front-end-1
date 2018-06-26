import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { BASE_URL_SERVICE } from '../../constants';
import { MetaKpi} from '../../models/meta-kpi';

@Injectable()
export class MetaManualService {

   /* 
   * URL del servicio del componente
   */
  private URL = BASE_URL_SERVICE + '/ETADMetas';


  constructor(private http: HttpClient) { }

  /*
   * Consulta de catalogos. Its important for form of assigment
   */
  getCatalogos(id_usuario: number): Observable<any> {
    return this.http.get<any>(this.URL + '?action=loadCombobox&id_usuario=' + id_usuario);
  }

  insertMetas(id_usuario: number, meta: MetaKpi): Observable<any> {
    const body = new HttpParams()
      .set('action', 'insertMetas')
      .set('meta', ''+JSON.stringify(meta))
      .set('id_usuario', '' + id_usuario);
    return this.http.post(this.URL, body);
  }

}
