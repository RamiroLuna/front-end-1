import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { BASE_URL_SERVICE } from '../../constants';
import { MetaKpi } from '../../models/meta-kpi';

@Injectable()
export class ListaValidacionService {

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

  getDetailIndicadores(idUsuario:number,id_grupo:number,id_etad:number,dia:string): Observable<any> {
    return this.http.get<any>(this.URL + '?action=getDetailIndicadores&id_usuario='+idUsuario+'&id_grupo='+id_grupo+'&id_etad='+id_etad+'&frecuencia=diario'+'&dia='+dia);
  }

  getAllIndicadores(id_usuario:number, idPeriodo:number, idEtad:number,idGrupo:number): Observable<any>{
    const body = new HttpParams()
    .set('action', 'getAllIndicadores')
    .set('id_periodo', ""+idPeriodo)
    .set('id_etad', ""+idEtad)
    .set('id_grupo', ""+idGrupo)
    .set('frecuencia', "diario")
    .set('id_usuario', ""+id_usuario)
    return this.http.post<any>(this.URL,body);
  }

/*
 * Bloque de codigo validar
 */
validateIndicadores(id_usuario: number, id_grupo:number,id_etad:number, dia:string  ): Observable<any> {
  const body = new HttpParams()
    .set('action', 'validateIndicadores')
    .set('id_grupo', ''+id_grupo)
    .set('id_etad', ''+id_etad)
    .set('dia', ''+dia)
    .set('id_usuario', '' + id_usuario);
  return this.http.post(this.URL, body);
}

/*
 * Bloque de codigo remover la validacion de indicadores
 */
removeValidationIndicadores(id_usuario: number, id_grupo:number,id_etad:number, dia:string  ): Observable<any> {
  const body = new HttpParams()
    .set('action', 'removeValidationIndicadores')
    .set('id_grupo', ''+id_grupo)
    .set('id_etad', ''+id_etad)
    .set('dia', ''+dia)
    .set('id_usuario', '' + id_usuario);
  return this.http.post(this.URL, body);
}

}
