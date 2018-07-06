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

  preview(id_usuario:number, file:string, idEtad:number=-1, tipo_ponderacion:number, anio:number=-1): Observable<any>{
    const body = new HttpParams()
    .set('action', 'preview')
    .set('file', file)
    .set('tipo_ponderacion', ""+tipo_ponderacion)
    .set('id_etad', ""+idEtad) 
    .set('anio', ""+anio)
    .set('id_usuario', ""+id_usuario)
    return this.http.post<any>(this.URL,body);
  }


  loadData(id_usuario:number, anio:any, tipo_ponderacion:number, id_etad:number = -1): Observable<any>{
    const body = new HttpParams()
    .set('action', 'loadData')
    .set('anio', ""+anio)
    .set('tipo_ponderacion', ""+tipo_ponderacion)
    .set('id_etad', ""+id_etad)
    .set('id_usuario', ""+id_usuario)
    return this.http.post<any>(this.URL,body);
  }

  rewriteData(id_usuario:number, anio:number, tipo_ponderacion:number, id_etad:number = -1): Observable<any>{
    const body = new HttpParams()
    .set('action', 'rewriteData')
    .set('anio', ""+anio)
    .set('id_etad', ""+id_etad)
    .set('tipo_ponderacion', ""+tipo_ponderacion)
    .set('id_usuario', ""+id_usuario)
    return this.http.post<any>(this.URL,body);
  }

  downloadTempleate(id_usuario:number, tipo_ponderacion:number, anio:number = -1, id_etad:number =-1): Observable<any>{
    const body = new HttpParams()
    .set('action', 'downloadTempleate')
    .set('tipo_ponderacion', ""+tipo_ponderacion)
    .set('anio', ""+anio)
    .set('id_etad', ""+id_etad)
    .set('id_usuario', ""+id_usuario)
    return this.http.post<any>(this.URL,body);
  }

}
