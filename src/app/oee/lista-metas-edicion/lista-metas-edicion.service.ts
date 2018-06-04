import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { Forecast } from '../../models/forecast';
import { BASE_URL_SERVICE } from '../../constants';

@Injectable()
export class ListaMetasEdicionService {

  private URL = BASE_URL_SERVICE + '/Metas';

  constructor(private http: HttpClient) { }

  /*
   * Consulta de catalogos
   */
  getInitCatalogos(idUsuario:number): Observable<any> {
    return this.http.get<any>(this.URL + '?action=loadCombobox&id_usuario='+idUsuario);
  }

  getAllMetas(id_usuario:number, idPeriodo:number, IdLinea:number): Observable<any>{
    const body = new HttpParams()
    .set('action', 'getAllMetas')
    .set('id_periodo', ""+idPeriodo)
    .set('id_linea', ""+IdLinea)
    .set('id_usuario', ""+id_usuario)
    return this.http.post<any>(this.URL,body);
  }

  delete(id_usuario: number, id_meta: number): Observable<any> {
    const body = new HttpParams()
      .set('action', 'deleteMeta')
      .set('id_meta', '' + id_meta)
      .set('id_usuario', '' + id_usuario)
    return this.http.post(this.URL, body);
  }

  updateMeta(id_usuario: number, meta:any): Observable<any> {
    const body = new HttpParams()
      .set('action', 'updateMeta')
      .set('id_meta', ''+meta.id_meta)
      .set('dia', ''+meta.tmpDia)
      .set('meta', ''+meta.meta)
      .set('tmp', ''+meta.tmp)
      .set('velocidad', ''+meta.velocidad)
      .set('id_turno', ''+meta.turno)
      .set('id_grupo', ''+meta.tmpGrupo)
      .set('estatus', ''+meta.estatus)
      .set('id_usuario', '' + id_usuario)

    return this.http.post(this.URL, body);
  }

}
