import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { BASE_URL_SERVICE } from '../../constants';
import { MetaKpi } from '../../models/meta-kpi';

@Injectable()
export class ListaIndicadorDayService {

  /* 
   * URL del servicio del componente
   */
  private URL = BASE_URL_SERVICE + '/EtadIndicadores';


  constructor(private http: HttpClient) { }
  
  /*
   * Consulta de catalogos
   */
  getInitCatalogos(idUsuario:number): Observable<any> {
    return this.http.get<any>(this.URL + '?action=loadCombobox&id_usuario='+idUsuario);
  }

  getAllIndicadores(id_usuario:number, idPeriodo:number, idEtad:number): Observable<any>{
    const body = new HttpParams()
    .set('action', 'getAllIndicadores')
    .set('id_periodo', ""+idPeriodo)
    .set('id_etad', ""+idEtad)
    .set('frecuencia', "diario")
    .set('id_usuario', ""+id_usuario)
    return this.http.post<any>(this.URL,body);
  }

}
