import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { BASE_URL_SERVICE } from '../constants';
import { Catalogo } from '../models/catalogo';
import { Linea } from '../models/linea';

@Injectable()
export class CatalogosGeneralesService {

  private URL = BASE_URL_SERVICE + '/Catalogos';
  private URL_ETAD = BASE_URL_SERVICE + '/EtadCatalogos';
  private URL_LINEA = BASE_URL_SERVICE + '/Lineas';

  constructor(private http: HttpClient) { }

  /* 
   * Retorna todos los elementos registrados en el catalogo
   */
  getAllCatalogos(id_usuario: number, table_name: string): Observable<any> {
    return this.http.get<any>(this.URL + '?action=getCatalogosData&tableName=' + table_name + '&id_usuario=' + id_usuario);
  }

  getCatalogoById(id_usuario: number,  table_name:string, id_catalogo:number): Observable<any> {
    return this.http.get<any>(this.URL + '?action=getDataByID&id_usuario=' + id_usuario + '&tableName='+table_name+'&idCatalogo='+id_catalogo);
  }

  agregar(id_usuario: number, tableName: string, catalogo: Catalogo): Observable<any> {
    const body = new HttpParams()
      .set('action', 'insertNewCatalogo')
      .set('tableName', tableName)
      .set('valor', catalogo.valor)
      .set('descripcion', "" + catalogo.descripcion)
      .set('id_usuario', "" + id_usuario);
    return this.http.post(this.URL, body);
  }

  
  update(id_usuario: number, tableName: string, catalogo: Catalogo): Observable<any> {
    const body = new HttpParams()
      .set('action', 'updateCatalogo')
      .set('tableName', tableName)
      .set('idCatalogo', "" + catalogo.id)
      .set('activoCatalogo', "" + catalogo.activo)
      .set('descripcion', catalogo.descripcion)
      .set('valor', catalogo.valor)
      .set('id_usuario', "" + id_usuario);
    return this.http.post(this.URL, body);
  }


  init(id_usuario: number): Observable<any> {
    return this.http.get<any>(this.URL_ETAD + '?action=loadCombobox&id_usuario=' + id_usuario);
  }

  insertCatalogo(id_usuario: number, tipo_catalogo:number, record:any): Observable<any> {
    const body = new HttpParams()
      .set('action', 'insertCatalogo')
      .set('tipo_catalogo', ''+tipo_catalogo)
      .set('record', ''+JSON.stringify(record))
      .set('id_usuario', '' + id_usuario );
    return this.http.post(this.URL_ETAD, body);
  }

  updateCatalogo(id_usuario: number, tipo_catalogo:number,record: any): Observable<any> {
    const body = new HttpParams()
      .set('action', 'updateCatalogo')
      .set('tipo_catalogo', ''+tipo_catalogo)
      .set('record', ''+JSON.stringify(record))
      .set('id_usuario', "" + id_usuario);
    return this.http.post(this.URL_ETAD, body);
  }

  getCatalogoByIdEtad(id_usuario: number,  tipo_catalogo:number, id_catalogo:number): Observable<any> {
    return this.http.get<any>(this.URL_ETAD + '?action=getCatalogoById&id_usuario=' + id_usuario + '&tipo_catalogo='+tipo_catalogo+'&id_catalogo='+id_catalogo);
  }

  /*
   * Peticiones para el catalogo de lineas
   */ 
  getLineaById(id_usuario: number, id_linea:number): Observable<any> {
    return this.http.get<any>(this.URL_LINEA + '?action=getDataByID&id_usuario=' + id_usuario + '&id_linea='+id_linea);
  }

  updateLinea(id_usuario: number, tipo_catalogo:number,linea: Linea): Observable<any> {
    const body = new HttpParams()
      .set('action', 'updateLineas')
      .set('id_linea', ''+linea.id_linea)
      .set('id_etad', ''+linea.id_etad)
      .set('id_gpo_linea', ''+linea.id_gpo_linea)
      .set('descripcion', ''+linea.descripcion)
      .set('valor', ''+linea.valor)
      .set('id_usuario', "" + id_usuario);
    return this.http.post(this.URL_LINEA, body);
  }


  insertLineas(id_usuario: number, tipo_catalogo:number,linea: Linea): Observable<any> {
    const body = new HttpParams()
      .set('action', 'insertLineas')
      .set('id_etad', ''+linea.id_etad)
      .set('id_gpo_linea', ''+linea.id_gpo_linea)
      .set('descripcion', ''+linea.descripcion)
      .set('valor', ''+linea.valor)
      .set('id_usuario', "" + id_usuario);
    return this.http.post(this.URL_LINEA, body);
  }

  getAllLineas(id_usuario: number): Observable<any> {
    return this.http.get<any>(this.URL_LINEA + '?action=getLineas&id_usuario=' + id_usuario);
  }

  loadCombobox(id_usuario: number): Observable<any> {
    return this.http.get<any>(this.URL_LINEA + '?action=loadCombobox&id_usuario=' + id_usuario);
  }

  /*
   *  Fin peticiones para el catalogo de lineas
   */ 

}
