import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { BASE_URL_SERVICE } from '../../constants';


@Injectable()
export class RptDisponibilidadService {

  private URL = BASE_URL_SERVICE + '/Reportes';

  constructor(private http: HttpClient) { }

  /*
   * Consulta de catalogo de lineas. Its important for form of Line
   */
  getCatalogos(id_usuario: number): Observable<any> {
    return this.http.get<any>(this.URL + '?action=loadCombobox&id_usuario=' + id_usuario);
  }
  /*
   * Consulta reporte de fallas
   */
  reporteDisponibilidad(id_usuario: number, params:any): Observable<any> {
    return this.http.get<any>(this.URL + '?action=reporteEficiencia&id_usuario=' + id_usuario + '&fecha_inicio='+params.inicio +'&fecha_termino='+params.fin+'&id_linea='+params.id_linea);
  }

}
