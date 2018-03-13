import { Injectable } from '@angular/core';
import { Catalogo } from '../../../models/catalogo';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { BASE_URL_SERVICE } from '../../../constants';

@Injectable()
export class FormularioDetalleServiceService {

  private URL = BASE_URL_SERVICE + '/Catalogos';

  constructor(private http: HttpClient) { }

  agregar(id_usuario: number, tableName: string, catalogo: Catalogo): Observable<any> {
    const body = new HttpParams()
      .set('action', 'insertNewCatalogo')
      .set('tableName', tableName)
      .set('descripcion', "" + catalogo.descripcion)
      .set('id_usuario', "" + id_usuario);
    return this.http.post(this.URL, body);
  }

  update(id_usuario: number, tableName: string, catalogo: Catalogo): Observable<any> {
    const body = new HttpParams()
      .set('action', 'updateCatalogo')
      .set('tableName', tableName)
      .set('idCatalogo', "" + catalogo.id)
      .set('activoCatalogo', "" + catalogo.activo)
      .set('descripcion', catalogo.descripcion)
      .set('id_usuario', "" + id_usuario);
    return this.http.post(this.URL, body);
  }

  getElementById(id_usuario: number, tableName: string, id_catalogo:number): Observable<any> {
    return this.http.get<Catalogo>(this.URL + '?action=getDataByID&tableName=' + tableName + '&id_usuario=' + id_usuario + '&idCatalogo='+id_catalogo);
  }

}
