import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { BASE_URL_SERVICE } from '../../constants';

@Injectable()
export class MetaMasivaService {

  private URL = BASE_URL_SERVICE + '/EtadMetasMasivas';

  constructor(private http: HttpClient) { }

  getInitCatalogos(idUsuario: number): Observable<any> {
    return this.http.get<any>(this.URL + '?action=loadCombobox&id_usuario=' + idUsuario);
  }

  preview(id_usuario: number, file: string, idPeriodo: number, id_etad: number): Observable<any> {
    const body = new HttpParams()
      .set('action', 'preview')
      .set('file', file)
      .set('id_periodo', "" + idPeriodo)
      .set('id_etad', "" + id_etad)
      .set('id_usuario', "" + id_usuario)
    return this.http.post<any>(this.URL, body);
  }


  loadData(id_usuario: number, idPeriodo: number, idEtad: number): Observable<any> {
    const body = new HttpParams()
      .set('action', 'loadData')
      .set('id_periodo', "" + idPeriodo)
      .set('id_etad', "" + idEtad)
      .set('id_usuario', "" + id_usuario)
    return this.http.post<any>(this.URL, body);
  }

  rewriteData(id_usuario: number, idPeriodo: number, idEtad: number): Observable<any> {
    const body = new HttpParams()
      .set('action', 'rewriteData')
      .set('id_periodo', "" + idPeriodo)
      .set('id_etad', "" + idEtad)
      .set('id_usuario', "" + id_usuario)
    return this.http.post<any>(this.URL, body);
  }

  downloadTempleate(id_usuario:number , id_etad:number =-1): Observable<any>{
    const body = new HttpParams()
    .set('action', 'downloadTempleate')
    .set('id_etad', ""+id_etad)
    .set('id_usuario', ""+id_usuario)
    return this.http.post<any>(this.URL,body);
  }

}
