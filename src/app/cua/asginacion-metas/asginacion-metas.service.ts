import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { BASE_URL_SERVICE } from '../../constants';
import { Meta } from '../../models/meta';

@Injectable()
export class AsginacionMetasService {

  /* 
   * URL del servicio del componente
   */ 
  private URL = BASE_URL_SERVICE + '/Metas';
  

  constructor(private http: HttpClient) { }

  // /*
  //  * Bloque de codigo para peticiones de catalogos genericos
  //  */
  // agregar(id_usuario: number, meta: Meta): Observable<any> {
  //   const body = new HttpParams()
  //     .set('action', 'asignacionMetas')
  //     .set('action', 'asignacionMetas')
  //     .set('action', 'asignacionMetas')
  //     .set('action', 'asignacionMetas')
     
  //     .set('id_usuario', '' + id_usuario);
  //   return this.http.post(this.URL, body);
  // }

   
  /*
   * Consulta de catalogos. Its important for form of assigment
   */ 
  getCatalogos(id_usuario: number): Observable<any> {
    return this.http.get<any>(this.URL + '?action=asignacionMetas&id_usuario=' + id_usuario);
  }

}
