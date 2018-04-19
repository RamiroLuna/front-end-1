import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
// import { User } from '../../models/user';
import { BASE_URL_SERVICE } from '../../constants';

@Injectable()
export class MetaMasivaService {

  private URL = BASE_URL_SERVICE + '/UploadFile';

  constructor(private http: HttpClient) { }

  getInitCatalogos(idUsuario:number): Observable<any> {
    return this.http.get<any>(this.URL + '?action=loadCombobox');
  }

  uploadMetasCSV(id_usuario:number, file:string, idPeriodo:number, IdLinea:number): Observable<any>{
    const body = new HttpParams()
    .set('action', 'uploadMetasCSV')
    .set('file', file)
    .set('id_periodo', ""+idPeriodo)
    .set('id_linea', ""+IdLinea)
    .set('id_usuario', ""+id_usuario)
    return this.http.post<any>(this.URL,body);
  }


  procesarFile(id_usuario:number, idPeriodo:number, IdLinea:number): Observable<any>{
    const body = new HttpParams()
    .set('action', 'procesarFile')
    .set('id_periodo', ""+idPeriodo)
    .set('id_linea', ""+IdLinea)
    .set('id_usuario', ""+id_usuario)
    return this.http.post<any>(this.URL,body);
  }

}
