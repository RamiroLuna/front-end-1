import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { BASE_URL_SERVICE } from '../../constants';
import { MetaKpi } from '../../models/meta-kpi';

@Injectable()
export class ListaMetasService {

    /* 
   * URL del servicio del componente
   */
  private URL = BASE_URL_SERVICE + '/ETADMetas';


  constructor(private http: HttpClient) { }
  
  /*
   * Consulta de catalogos
   */
  getInitCatalogos(idUsuario:number): Observable<any> {
    return this.http.get<any>(this.URL + '?action=loadCombobox&id_usuario='+idUsuario);
  }

  getAllMetas(id_usuario:number, idPeriodo:number, idEtad:number): Observable<any>{
    const body = new HttpParams()
    .set('action', 'getAllMetas')
    .set('id_periodo', ""+idPeriodo)
    .set('id_etad', ""+idEtad)
    .set('id_usuario', ""+id_usuario)
    return this.http.post<any>(this.URL,body);
  }

  updateMeta(id_usuario: number, meta:any): Observable<any> {
    const body = new HttpParams()
      .set('action', 'updateMeta')
      .set('meta', '' + JSON.stringify(meta))
      .set('id_usuario', '' + id_usuario)
    return this.http.post(this.URL, body);
  }


}
