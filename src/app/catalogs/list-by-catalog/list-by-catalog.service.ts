import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { BASE_URL_SERVICE } from '../../constants';
import { Catalogo } from '../../models/catalogo';
import { Linea } from '../../models/linea';
import { EquipoAmut } from '../../models/equipo-amut';

@Injectable()
export class ListByCatalogService {

  private URL = BASE_URL_SERVICE + '/Catalogos';
  private URL_LINEAS = BASE_URL_SERVICE + '/Lineas';
  private URL_EQUIPOS_AMUT = BASE_URL_SERVICE + '/EquipoAmut';

  constructor(private http: HttpClient) { }

  /* 
   * Fragmento de codigo para catalogos genericos 
   */
  getElementsByCatalog(id_usuario: number, tableName: string): Observable<any> {
    return this.http.get<Catalogo>(this.URL + '?action=getCatalogosData&tableName=' + tableName + '&id_usuario=' + id_usuario);
  }

  update(id_usuario: number, tableName: string, catalogo: Catalogo): Observable<any> {
    const body = new HttpParams()
      .set('action', 'updateCatalogo')
      .set('tableName', tableName)
      .set('idCatalogo', "" + catalogo.id)
      .set('activoCatalogo', "" + catalogo.activo)
      .set('descripcion', catalogo.descripcion)
      .set('id_usuario', "" + id_usuario);
    return this.http.post(this.URL, body);
  }

  delete(id_usuario: number, tableName: string, id_catalogo: number): Observable<any> {
    const body = new HttpParams()
      .set('action', 'deleteCatalogo')
      .set('tableName', '' + tableName)
      .set('idCatalogo', '' + id_catalogo)
      .set('id_usuario', '' + id_usuario)
    return this.http.post(this.URL, body);
  }

   /*
    * Peticiones para catalogo de lineas
    */ 

  getElementsLineas(id_usuario: number, tableName: string): Observable<any> {
    return this.http.get<Linea>(this.URL_LINEAS + '?action=getLineas&tableName=' + tableName + '&id_usuario=' + id_usuario);
  }

  updateLinea(id_usuario: number, linea: Linea): Observable<any> {
    const body = new HttpParams()
      .set('action', 'updateLineas')
      .set('idLinea', "" + linea.id_linea)
      .set('activoLinea', "" + linea.activo)
      .set('gpoLinea', ""+linea.id_gpo_linea)
      .set('descripcionLinea', linea.descripcion)
      .set('id_usuario', "" + id_usuario);
    return this.http.post(this.URL_LINEAS, body);
  }

  deleteLinea(id_usuario: number, id_linea: number): Observable<any> {
    const body = new HttpParams()
      .set('action', 'deleteLineas')
      .set('idLinea', '' + id_linea)
      .set('id_usuario', '' + id_usuario)
    return this.http.post(this.URL_LINEAS, body);
  }


   /*
    * Peticiones para catalogo de equipos AMUT
    */ 
  getElementsEquipos(id_usuario: number): Observable<any> {
    return this.http.get<EquipoAmut>(this.URL_EQUIPOS_AMUT + '?action=getEquipos&id_usuario=' + id_usuario);
  }

  updateEquipoAmut(id_usuario: number, equipo: EquipoAmut): Observable<any> {
    const body = new HttpParams()
      .set('action', 'updateEquipos')
      .set('id_equipo', ''+equipo.id_equipo_amut)
      .set('activo', ''+equipo.activo)
      .set('nombre_equipo', equipo.nombre_equipo)
      .set('clave_equipo', equipo.clave_equipo)
      .set('id_usuario', "" + id_usuario);
    return this.http.post(this.URL_EQUIPOS_AMUT, body);
  }

  deleteEquipoAmut(id_usuario: number, id_equipo: number): Observable<any> {
    const body = new HttpParams()
      .set('action', 'deleteEquipos')
      .set('id_equipo', '' + id_equipo)
      .set('id_usuario', '' + id_usuario)
    return this.http.post(this.URL_EQUIPOS_AMUT, body);
  }


}
