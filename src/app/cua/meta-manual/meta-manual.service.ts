import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { BASE_URL_SERVICE } from '../../constants';
import { Forecast } from '../../models/forecast';

@Injectable()
export class MetaManualService {

  /* 
   * URL del servicio del componente
   */ 
  private URL = BASE_URL_SERVICE + '/Metas';
  

  constructor(private http: HttpClient) { }
   
  /*
   * Consulta de catalogos. Its important for form of assigment
   */ 
  getCatalogos(id_usuario: number): Observable<any> {
    return this.http.get<any>(this.URL + '?action=loadCombobox&id_usuario=' + id_usuario);
  }

  agregar(id_usuario: number, forecast: Forecast): Observable<any> {
    const body = new HttpParams()
      .set('action', 'asignaValorMeta')
      .set('id_grupo', ''+forecast.id_grupo)
      .set('id_turno', ''+forecast.id_turno)
      .set('dia_meta', ''+forecast.dia)
      .set('valor_meta', '' + forecast.meta)
      .set('id_usuario', '' + id_usuario);
    return this.http.post(this.URL, body);
  }

  update(id_usuario: number, forecast: Forecast): Observable<any> {
    const body = new HttpParams()
      .set('action', 'updateAsignacionMeta')
      .set('id_grupo', ''+forecast.id_grupo)
      .set('id_turno', ''+forecast.id_turno)
      .set('dia_meta', ''+forecast.dia)
      .set('valor_meta', '' + forecast.meta)
      .set('id_usuario', '' + id_usuario);
    return this.http.post(this.URL, body);
  }

  getAsignacionById(id_usuario: number, id_pro_meta:number): Observable<any> {
    return this.http.get<Forecast>(this.URL + '?action=getAsignacionById&id_usuario=' + id_usuario + '&id_pro_metas='+id_pro_meta);
  }

}
