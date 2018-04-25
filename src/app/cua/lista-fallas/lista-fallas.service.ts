import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { BASE_URL_SERVICE } from '../../constants';

@Injectable()
export class ListaFallasService {

  private URL = BASE_URL_SERVICE + '/Fallas';
 
  constructor(private http: HttpClient) { }

  /*
   * Consulta de catalogo de lineas. Its important for form of Line
   */ 
  getCatalogos(id_usuario: number): Observable<any> {
    return this.http.get<any>(this.URL + '?action=loadCombobox&id_usuario=' + id_usuario);
  }
  /*
   * Fin de catalogos requeirdos
   */ 

  getAllFallasByDays(id_usuario: number, params:any): Observable<any> {
    return this.http.get<any>(this.URL + '?action=getAllFallasByDays&id_usuario=' + id_usuario + 
    '&fecha_inicio='+ params.fecha_inicio +
    '&fecha_termino='+ params.fecha_inicio + 
    '&id_linea='+ params.fecha_inicio +
    '&id_grupo='+ params.fecha_inicio +
    '&id_turno='+ params.fecha_inicio );

  }


}
