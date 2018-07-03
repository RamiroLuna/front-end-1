import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { BASE_URL_SERVICE } from '../../constants';


@Injectable()
export class PonderacionMasivaService {

  private URL = BASE_URL_SERVICE + '/EtadPonderacion';

  constructor(private http: HttpClient) { }

  getInitCatalogos(idUsuario:number): Observable<any> {
    return this.http.get<any>(this.URL + '?action=loadCombobox&id_usuario='+idUsuario);
  }

  preview(id_usuario:number, file:string, idEtad:number, tipo_ponderacion:number, anio:number): Observable<any>{
    const body = new HttpParams()
    .set('action', 'preview')
    .set('file', file)
    .set('tipo_ponderacion', ""+tipo_ponderacion)
    // .set('id_etad', ""+idEtad) se comentan, descomentar solo si se necesitan
    .set('anio', ""+anio)
    .set('id_usuario', ""+id_usuario)
    return this.http.post<any>(this.URL,body);
  }


  loadData(id_usuario:number, idEtad:number, anio:any, tipo_meta:number): Observable<any>{
    const body = new HttpParams()
    .set('action', 'loadData')
    .set('id_etad', ""+idEtad)
    .set('anio', ""+anio)
    .set('tipo_meta', ""+tipo_meta)
    .set('id_usuario', ""+id_usuario)
    return this.http.post<any>(this.URL,body);
  }

  reWriteFile(id_usuario:number, idPeriodo:number, IdLinea:number): Observable<any>{
    const body = new HttpParams()
    .set('action', 'reWriteFile')
    .set('id_periodo', ""+idPeriodo)
    .set('id_linea', ""+IdLinea)
    .set('id_usuario', ""+id_usuario)
    return this.http.post<any>(this.URL,body);
  }

  downloadTempleate(id_usuario:number, tipo_ponderacion:number): Observable<any>{
    const body = new HttpParams()
    .set('action', 'downloadTempleate')
    .set('tipo_ponderacion', ""+tipo_ponderacion)
    .set('id_usuario', ""+id_usuario)
    return this.http.post<any>(this.URL,body);
  }

}
