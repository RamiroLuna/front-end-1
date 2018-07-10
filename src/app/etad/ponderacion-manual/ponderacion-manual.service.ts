import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { BASE_URL_SERVICE } from '../../constants';
import { MetaKpi} from '../../models/meta-kpi';

@Injectable()
export class PonderacionManualService {

     /* 
   * URL del servicio del componente
   */
  private URL = BASE_URL_SERVICE + '/EtadPonderacion';


  constructor(private http: HttpClient) { }

  /*
   * Consulta de catalogos. Its important for form of assigment
   */
  getCatalogos(id_usuario: number): Observable<any> {
    return this.http.get<any>(this.URL + '?action=loadCombobox&id_usuario=' + id_usuario);
  }

  insertPonderacion(id_usuario: number,tipo_ponderacion:number, meta: any, params:any={}): Observable<any> {
    const body = new HttpParams()
      .set('action', 'insertPonderacion')
      .set('tipo_ponderacion', ''+tipo_ponderacion)
      .set('anio', ''+params.anio)
      .set('id_etad', ''+params.idEtad)
      .set('meta', ''+JSON.stringify(meta))
      .set('id_usuario', '' + id_usuario);
    return this.http.post(this.URL, body);
  }

  getPonderacion(id_usuario: number, tipo_ponderacion:number, anio:number, id_etad:number): Observable<any> {
    return this.http.get<any>(this.URL + '?action=getPonderacion&id_usuario=' + id_usuario +'&tipo_ponderacion='+tipo_ponderacion+'&anio='+anio + '&id_etad='+id_etad);
  }
}
