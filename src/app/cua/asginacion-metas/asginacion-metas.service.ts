import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { BASE_URL_SERVICE } from '../../constants';
import { MetaAsignacion } from '../../models/meta-asignacion';

@Injectable()
export class AsginacionMetasService {

  /* 
   * URL del servicio del componente
   */ 
  private URL = BASE_URL_SERVICE + '/Metas';
  

  constructor(private http: HttpClient) { }
   
  /*
   * Consulta de catalogos. Its important for form of assigment
   */ 
  getCatalogos(id_usuario: number): Observable<any> {
    return this.http.get<any>(this.URL + '?action=loadComboxData&id_usuario=' + id_usuario);
  }

  agregar(id_usuario: number, asignacion: MetaAsignacion): Observable<any> {
    const body = new HttpParams()
      .set('action', 'asignaValorMeta')
      .set('id_grupo', ''+asignacion.id_grupo)
      .set('id_turno', ''+asignacion.id_turno)
      .set('id_meta', ''+asignacion.id_meta)
      .set('dia_meta', ''+asignacion.dia)
      .set('valor_meta', '' + asignacion.valor)
      .set('id_usuario', '' + id_usuario);
    return this.http.post(this.URL, body);
  }

  update(id_usuario: number, asignacion: MetaAsignacion): Observable<any> {
    const body = new HttpParams()
      .set('action', 'asignaValorMeta')
      .set('id_grupo', ''+asignacion.id_grupo)
      .set('id_turno', ''+asignacion.id_turno)
      .set('id_meta', ''+asignacion.id_meta)
      .set('dia_meta', ''+asignacion.dia)
      .set('valor_meta', '' + asignacion.valor)
      .set('id_usuario', '' + id_usuario);
    return this.http.post(this.URL, body);
  }

  getAsignacionById(id_usuario: number, id_pro_meta:number): Observable<any> {
    return this.http.get<MetaAsignacion>(this.URL + '?action=getAsignacionById&id_usuario=' + id_usuario + '&id_pro_metas='+id_pro_meta);
  }

}
