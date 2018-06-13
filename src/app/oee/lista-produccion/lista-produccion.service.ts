import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { BASE_URL_SERVICE } from '../../constants';

@Injectable()
export class ListaProduccionService {

  private URL = BASE_URL_SERVICE + '/Produccion';

  constructor(private http: HttpClient) { }

  
  /*
   * Consulta de catalogos
   */
  getInitCatalogos(idUsuario:number): Observable<any> {
    return this.http.get<any>(this.URL + '?action=loadCombobox&id_usuario='+idUsuario);
  }

  getProduccion(id_usuario:number,id_periodo:number,id_linea:number,id_gpo_linea:number): Observable<any>{
    return this.http.get<any>(this.URL + '?action=getProduccionByPeriodo&id_usuario='+id_usuario+'&id_periodo='+id_periodo+'&id_linea='+id_linea+'&id_gpo_linea='+id_gpo_linea);
  }


}
