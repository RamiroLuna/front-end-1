import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { BASE_URL_SERVICE } from '../../constants';
import { PetIshikawa } from '../../models/pet-ishikawa';

@Injectable()
export class ListaIshikawasService {

  private URL = BASE_URL_SERVICE + '/Ishikawa';

  constructor(private http: HttpClient) { }

  /*
   * Consulta de catalogos
   */
  getInitCatalogos(idUsuario: number): Observable<any> {
    return this.http.get<any>(this.URL + '?action=loadCombobox&id_usuario=' + idUsuario);
  }

  getAllIshikawas(idUsuario: number, id_periodo: number, id_etad: number): Observable<any> {
    return this.http.get<any>(this.URL + '?action=getAllIshikawas&id_etad=' + id_etad + '&id_periodo=' + id_periodo + '&id_usuario=' + idUsuario);
  }

  getIshikawaById(idUsuario: number, id_ishikawa: number): Observable<any> {
    return this.http.get<any>(this.URL + '?action=getIshikawaById&id_ishikawa=' + id_ishikawa + '&id_usuario=' + idUsuario);
  }

  deleteIshikawa(id_usuario: number, ishikawa: PetIshikawa): Observable<any> {
    const body = new HttpParams()
      .set('action', 'deleteIshikawa')
      .set('id_ishikawa', ''+ishikawa.id)
      .set('id_usuario', '' + id_usuario);
    return this.http.post(this.URL, body);
  }

}
