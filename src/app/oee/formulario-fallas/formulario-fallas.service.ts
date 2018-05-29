import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { BASE_URL_SERVICE } from '../../constants';
import { Producto } from '../../models/producto';
import { Linea } from '../../models/linea';
import { Falla } from '../../models/falla';

@Injectable()
export class FormularioFallasService {

   /* 
   * URL del servicio del componente
   */ 

  private URL = BASE_URL_SERVICE + '/Fallas';

  constructor(private http: HttpClient) { }

    /*
   * Consulta de catalogo de lineas. Its important for form of Line
   */ 
  getCatalogos(id_usuario: number): Observable<any> {
    return this.http.get<any>(this.URL + '?action=loadComboboxAndMeta&id_usuario=' + id_usuario);
  }
  /*
   * Fin de catalogos requeirdos
   */ 

   /*
    * Consulta  falla consultada
    */ 
  getFalla(id_usuario: number, id_falla:number): Observable<any> {
    return this.http.get<Falla>(this.URL + '?action=getFallaById&id_usuario=' + id_usuario + '&id_falla='+id_falla);
  }
    /*
    * Fin de la falla consultada
    */ 


    /*
   * Bloque de codigo para peticiones CRUD fallas
   */
  agregar(id_usuario: number, falla: Falla): Observable<any> {
    const body = new HttpParams()
      .set('action', 'insertFalla')
      .set('descripcion', ''+falla.descripcion)
      .set('hora_inicio', ''+falla.hora_inicio)
      .set('hora_final', ''+falla.hora_final)
      .set('tiempo_paro', ''+falla.tiempo_paro)
      .set('id_razon', ''+falla.id_razon)
      .set('id_equipo', ''+falla.id_equipo)
      .set('id_meta', ''+falla.id_meta)
      .set('id_usuario', '' + id_usuario);
    return this.http.post(this.URL, body);
  }

    /*
   * Bloque de codigo para peticiones CRUD fallas
   */
  update(id_usuario: number, falla: Falla): Observable<any> {
    const body = new HttpParams()
    .set('action', 'updateFalla')
    .set('descripcion', ''+falla.descripcion)
    .set('hora_inicio', ''+falla.hora_inicio)
    .set('hora_final', ''+falla.hora_final)
    .set('tiempo_paro', ''+falla.tiempo_paro)
    .set('id_falla', ''+falla.id_falla)
    .set('id_razon', ''+falla.id_razon)
    .set('id_equipo', ''+falla.id_equipo)
    .set('id_meta', ''+falla.id_meta)
    .set('id_usuario', '' + id_usuario);
    return this.http.post(this.URL, body);
  }


}
