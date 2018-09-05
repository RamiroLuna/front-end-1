import { Injectable } from '@angular/core';
import { BASE_URL_SERVICE } from '../../constants';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class OptionsService {

  /* 
   * URL del servicio del componente
   */ 

  private URL = BASE_URL_SERVICE + '/Produccion';

  constructor(private http: HttpClient) { }
    /*
   * Consulta datos video wall
   */ 
  generateVideoWall(id_usuario: number): Observable<any> {
    return this.http.get<any>(this.URL + '?action=generateVideoWall&id_usuario=' + id_usuario);
  }

  

}
