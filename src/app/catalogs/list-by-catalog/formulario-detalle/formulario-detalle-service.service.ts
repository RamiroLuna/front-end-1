import { Injectable } from '@angular/core';
import { Catalogo } from '../../../models/catalogo';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { BASE_URL_SERVICE } from '../../../constants';
import { Linea } from '../../../models/linea';
import { EquipoAmut } from '../../../models/equipo-amut';

@Injectable()
export class FormularioDetalleServiceService {

  private URL = BASE_URL_SERVICE + '/Catalogos';
  private URL_LINEAS = BASE_URL_SERVICE + '/Lineas';
  private URL_EQUIPOS_AMUT = BASE_URL_SERVICE + '/EquipoAmut';

  constructor(private http: HttpClient) { }
  
  /*
   * Bloque de codigo para peticiones de catalogos genericos
   */
  agregar(id_usuario: number, tableName: string, catalogo: Catalogo): Observable<any> {
    const body = new HttpParams()
      .set('action', 'insertNewCatalogo')
      .set('tableName', tableName)
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
      .set('id_usuario', "" + id_usuario);
    return this.http.post(this.URL, body);
  }

  getElementById(id_usuario: number, tableName: string, id_catalogo:number): Observable<any> {
    return this.http.get<Catalogo>(this.URL + '?action=getDataByID&tableName=' + tableName + '&id_usuario=' + id_usuario + '&idCatalogo='+id_catalogo);
  }

  /*
   * Bloque de codigo para peticiones de catalogos de lineas
   */
  agregarLinea(id_usuario: number, linea: Linea): Observable<any> {
    const body = new HttpParams()
      .set('action', 'insertLineas')
      .set('gpoLinea', ''+linea.id_gpo_linea )
      .set('descripcionLinea', ''+ linea.descripcion)
      .set('id_usuario', '' + id_usuario );
    return this.http.post(this.URL_LINEAS, body);
  }

  updateLinea(id_usuario: number, linea: Linea): Observable<any> {
    const body = new HttpParams()
      .set('action', 'updateLineas')
      .set('idLinea', '' + linea.id_linea)
      .set('activoLinea', '' + linea.activo)
      .set('gpoLinea', '' + linea.id_gpo_linea)
      .set('descripcionLinea', '' + linea.descripcion)
      .set('id_usuario', "" + id_usuario);
    return this.http.post(this.URL_LINEAS, body);
  }

  getElementLineaById(id_usuario: number,  id_linea:number): Observable<any> {
    return this.http.get<Linea>(this.URL_LINEAS + '?action=getDataByID&id_usuario=' + id_usuario + '&idLinea='+id_linea);
  }

  getElementsCatalogo(id_usuario: number, nombre_tabla:string): Observable<any> {
    return this.http.get<Catalogo>(this.URL + '?action=getCatalogosData&id_usuario=' + id_usuario + '&tableName='+nombre_tabla);
  }

    /*
   * Bloque de codigo para peticiones de catalogos de lineas
   */
  agregarEquipoAmut(id_usuario: number, equipo: EquipoAmut): Observable<any> {
    const body = new HttpParams()
      .set('action', 'insertNewEquipos')
      .set('nombre_equipo', ''+ equipo.nombre_equipo)
      .set('clave_equipo', ''+ equipo.clave_equipo)
      .set('id_usuario', '' + id_usuario );
    return this.http.post(this.URL_EQUIPOS_AMUT, body);
  }

  updateEquipoAmut(id_usuario: number, equipo: EquipoAmut): Observable<any> {
    const body = new HttpParams()
      .set('action', 'updateEquipos')
      .set('id_equipo', ''+equipo.id_equipo_amut)
      .set('activo', ''+equipo.activo)
      .set('nombre_equipo', ''+equipo.nombre_equipo )
      .set('clave_equipo', ''+equipo.clave_equipo)
      .set('id_usuario', "" + id_usuario);
    return this.http.post(this.URL_EQUIPOS_AMUT, body);
  }

  getElementEquipoAmutById(id_usuario: number,  id_equipo:number): Observable<any> {
    return this.http.get<Linea>(this.URL_EQUIPOS_AMUT + '?action=getDataByID&id_usuario=' + id_usuario + '&id_equipo='+id_equipo);
  }

}
