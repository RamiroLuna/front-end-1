import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { Forecast } from '../../models/forecast';
import { BASE_URL_SERVICE } from '../../constants';

@Injectable()
export class ListaPonderacionService {

  private URL = BASE_URL_SERVICE + '/EtadPonderacion';

  constructor(private http: HttpClient) { }

  /*
   * Consulta de catalogos
   */
  getInitCatalogos(idUsuario:number): Observable<any> {
    return this.http.get<any>(this.URL + '?action=loadCombobox&id_usuario='+idUsuario);
  }

  getPonderacion(id_usuario:number, tipo_ponderacion:number, anio:number, id_etad:number = -1): Observable<any>{
    const body = new HttpParams()
    .set('action', 'getPonderacion')
    .set('tipo_ponderacion', ""+tipo_ponderacion)
    .set('anio', ""+anio)
    .set('id_etad', ""+id_etad)
    .set('id_usuario', ""+id_usuario)
    return this.http.post<any>(this.URL,body);
  }


  updatePonderacion(id_usuario: number, tipo_ponderacion:number, meta:any): Observable<any> {
    const body = new HttpParams()
      .set('action', 'updatePonderacion')
      .set('tipo_ponderacion', ''+tipo_ponderacion)
      .set('meta', ''+JSON.stringify(meta))   
      .set('id_usuario', '' + id_usuario)

    return this.http.post(this.URL, body);
  }

}
