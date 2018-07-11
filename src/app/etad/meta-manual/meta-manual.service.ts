import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { BASE_URL_SERVICE } from '../../constants';

@Injectable()
export class MetaManualService {

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

  insertMetas(id_usuario: number,id_periodo:number, id_etad: number, meta:any): Observable<any> {
    const body = new HttpParams()
      .set('action', 'insertMetas')
      .set('id_etad', '' + id_etad)
      .set('id_periodo', '' + id_periodo)
      .set('meta', '' + JSON.stringify(meta))
      .set('id_usuario', '' + id_usuario)
    return this.http.post(this.URL, body);
  }



}
