import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { BASE_URL_SERVICE } from '../../constants';

@Injectable()
export class ListaIshikawasService {

  private URL = BASE_URL_SERVICE + '/Ishikawa';

  constructor(private http: HttpClient) { }

  /*
   * Consulta de catalogos
   */
  getInitCatalogos(idUsuario:number): Observable<any> {
    return this.http.get<any>(this.URL + '?action=loadCombobox&id_usuario='+idUsuario);
  }

  getAllIshikawas(idUsuario:number, id_periodo:number, id_etad:number): Observable<any> {
    return this.http.get<any>(this.URL + '?action=getAllIshikawas&id_etad='+id_etad+'&id_periodo='+id_periodo+'&id_usuario='+idUsuario);
  }

}
