import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { BASE_URL_SERVICE } from '../../constants';
import { Producto } from '../../models/producto';
import { Linea } from '../../models/linea';
import { Catalogo } from '../../models/catalogo';

@Injectable()
export class FormularioProduccionService {

  /* 
   * URL del servicio del componente
   */ 

  private URL = BASE_URL_SERVICE + '/Produccion';

  constructor(private http: HttpClient) { }

  /*
   * Consulta de catalogo de lineas. Its important for form of Line
   */ 
  init(id_usuario: number): Observable<any> {
    return this.http.get<any>(this.URL + '?action=loadCombobox&id_usuario=' + id_usuario);
  }
  /*
   * Fin de catalogos requeirdos
   */ 

  /*
   * Consulta detalle de produccion
   */ 
  getDetailsProduccion(id_usuario: number, id_meta:number): Observable<any> {
    return this.http.get<any>(this.URL + '?action=getDetailsProduccion&id_usuario=' + id_usuario + '&id_meta='+id_meta);
  }
  /*
   * Fin de catalogos requeirdos
   */ 


    /*
   * Bloque de codigo para peticiones insert produccion
   */
  agregar(id_usuario: number, productos: Array<any>, id_meta:number): Observable<any> {

    const body = new HttpParams()
      .set('action', 'insertProduccion')
      .set('productos', ''+JSON.stringify(productos))
      .set('id_meta', ''+id_meta)
      .set('id_usuario', '' + id_usuario);
    return this.http.post(this.URL, body);
  }

    /*
   * Bloque de codigo para peticiones insert produccion
   */
  update(id_usuario: number, productos: Array<any>): Observable<any> {

    const body = new HttpParams()
      .set('action', 'updateProduccion')
      .set('productos', ''+JSON.stringify(productos))
      .set('id_usuario', '' + id_usuario);
    return this.http.post(this.URL, body);
  }



}
