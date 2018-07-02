import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { BASE_URL_SERVICE } from '../../../constants';



@Injectable()
export class FormularioDetalleService {

  private URL = BASE_URL_SERVICE + '/EtadCatalogos';

  constructor(private http: HttpClient) { }
  /*
   * Bloque de codigo para peticiones de catalogos 
   */

  init(id_usuario: number): Observable<any> {
    return this.http.get<any>(this.URL + '?action=loadCombobox&id_usuario=' + id_usuario);
  }

  insertCatalogo(id_usuario: number, tipo_catalogo:number, record:any): Observable<any> {
    const body = new HttpParams()
      .set('action', 'insertCatalogo')
      .set('tipo_catalogo', ''+tipo_catalogo)
      .set('record', ''+JSON.stringify(record))
      .set('id_usuario', '' + id_usuario );
    return this.http.post(this.URL, body);
  }

  updateCatalogo(id_usuario: number, tipo_catalogo:number,record: any): Observable<any> {
    const body = new HttpParams()
      .set('action', 'updateCatalogo')
      .set('tipo_catalogo', ''+tipo_catalogo)
      .set('record', ''+JSON.stringify(record))
      .set('id_usuario', "" + id_usuario);
    return this.http.post(this.URL, body);
  }

  getCatalogoById(id_usuario: number,  tipo_catalogo:number, id_catalogo:number): Observable<any> {
    return this.http.get<any>(this.URL + '?action=getCatalogoById&id_usuario=' + id_usuario + '&tipo_catalogo='+tipo_catalogo+'&id_catalogo='+id_catalogo);
  }

}
