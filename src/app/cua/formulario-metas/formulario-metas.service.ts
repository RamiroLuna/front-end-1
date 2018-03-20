import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { BASE_URL_SERVICE } from '../../constants';
import { Linea } from '../../models/linea';
import { Meta } from '../../models/meta';


@Injectable()
export class FormularioMetasService {
  
  /*
   * URL_LINEAS para consultar las lineas que estan disponibles
   */ 
  private URL_LINEAS = BASE_URL_SERVICE + '/Lineas';
  
  /* 
   * URL del servicio del componente
   */ 
  private URL = BASE_URL_SERVICE + '/Metas';
  

  constructor(private http: HttpClient) { }
 
  /*
   * Consulta de catalogo de lineas. Its important for form of Line
   */ 
  getLineas(id_usuario: number): Observable<any> {
    return this.http.get<Linea>(this.URL_LINEAS + '?action=getLineas&&id_usuario=' + id_usuario);
  }
  /*
   * Fin de catalogos requeirdos
   */ 

  /*
   * Bloque de codigo para peticiones de catalogos genericos
   */
  agregar(id_usuario: number, meta: Meta): Observable<any> {
    const body = new HttpParams()
      .set('action', 'insertNewMetaCatalog')
      .set('idLinea', '' + meta.id_linea)
      .set('meta', ''+meta.meta)
      .set('tipoMedida', ''+meta.tipo_medida)
      .set('id_usuario', '' + id_usuario);
    return this.http.post(this.URL, body);
  }

  update(id_usuario: number,  meta: Meta): Observable<any> {
    const body = new HttpParams()
      .set('action', 'updateNewMetaCatalog')
      .set('idMeta', ''+ meta.id_meta)
      .set('idLinea', ''+meta.id_linea)
      .set('activo', ''+meta.activo)
      .set('posicion', ''+meta.posicion)
      .set('meta', ''+ meta.meta)
      .set('tipoMedida', ''+meta.tipo_medida)
      .set('id_usuario', "" + id_usuario);
    return this.http.post(this.URL, body);
  }

  getMeta(id_usuario: number, id_meta:number): Observable<any> {
    return this.http.get<Meta>(this.URL + '?action=getDataMetasCatalogById&&id_usuario=' + id_usuario + '&idMeta='+id_meta);
  }


}
