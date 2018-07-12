import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { BASE_URL_SERVICE } from '../../constants';
import { MetaKpi } from '../../models/meta-kpi';


@Injectable()
export class ListaIndicatorMothService {

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

  getDetailIndicadores(idUsuario:number,id_grupo:number,id_etad:number,id_periodo:number): Observable<any> {
    return this.http.get<any>(this.URL + '?action=getDetailIndicadores&id_usuario='+idUsuario+'&id_grupo='+id_grupo+'&id_etad='+id_etad+'&frecuencia=mensual'+'&id_periodo='+id_periodo);
  }

  getAllIndicadores(id_usuario:number, idPeriodo:number, idEtad:number): Observable<any>{
    const body = new HttpParams()
    .set('action', 'getAllIndicadores')
    .set('id_periodo', ""+idPeriodo)
    .set('id_etad', ""+idEtad)
    .set('frecuencia', "mensual")
    .set('id_usuario', ""+id_usuario)
    return this.http.post<any>(this.URL,body);
  }

    /*
 * Bloque de codigo para peticiones CRUD indicador diario
 */
updateIndicadores(id_usuario: number, datos: any ): Observable<any> {
  const body = new HttpParams()
    .set('action', 'updateIndicadores')
    .set('frecuencia', 'mensual')
    .set('datos', ''+JSON.stringify(datos))
    .set('id_usuario', '' + id_usuario);
  return this.http.post(this.URL, body);
}

}
