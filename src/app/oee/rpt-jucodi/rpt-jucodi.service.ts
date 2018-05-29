import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { BASE_URL_SERVICE } from '../../constants';

@Injectable()
export class RptJucodiService {

  private URL = BASE_URL_SERVICE + '/Reportes';

  constructor(private http: HttpClient) { }

  /*
   * Consulta de catalogo de lineas. Its important for form of Line
   */
  getCatalogos(id_usuario: number): Observable<any> {
    return this.http.get<any>(this.URL + '?action=loadCombobox&id_usuario=' + id_usuario);
  }

  /*
   * Consulta reporte 
   */
  reporteJUCODI(id_usuario: number, params:any): Observable<any> {
    return this.http.get<any>(this.URL + '?action=reporteJUCODI&id_usuario=' + id_usuario + '&dia='+params.dia +'&id_gpo_linea='+params.idGpoLinea);
  }

  /*
   * Consulta reporte 
   */
  reporteDailyPerformance(id_usuario: number, params:any): Observable<any> {
    return this.http.get<any>(this.URL + '?action=reporteDailyPerformance&id_usuario=' + id_usuario + '&id_periodo='+params.idPeriodo +'&id_gpo_linea='+params.idGpoLinea);
  }
}
