import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { BASE_URL_SERVICE } from '../../constants';
import { Producto } from '../../models/producto';
import { Linea } from '../../models/linea';

@Injectable()
export class FormularioProductoService {
  /*
   * URL_LINEAS para consultar las lineas que estan disponibles
   */ 
  private URL_LINEAS = BASE_URL_SERVICE + '/Lineas';

  /* 
   * URL del servicio del componente
   */ 

  private URL = BASE_URL_SERVICE + '/Productos';

  constructor(private http: HttpClient) { }

  /*
   * Consulta de catalogo de lineas. Its important for form of Line
   */ 
  getLineas(id_usuario: number): Observable<any> {
    return this.http.get<Linea>(this.URL_LINEAS + '?action=getLineas&id_usuario=' + id_usuario);
  }
  /*
   * Fin de catalogos requeirdos
   */ 


    /*
   * Bloque de codigo para peticiones de catalogos genericos
   */
  agregar(id_usuario: number, producto: Producto): Observable<any> {
    const body = new HttpParams()
      .set('action', 'insertNewCarProductos')
      .set('id_linea', ''+producto.id_linea)
      .set('tipo_medida', ''+producto.tipo_medida)
      .set('producto', ''+producto.producto)
      .set('id_usuario', '' + id_usuario);
    return this.http.post(this.URL, body);
  }

  update(id_usuario: number,  producto: Producto): Observable<any> {
    const body = new HttpParams()
      .set('action', 'updateCarProductos')
      .set('id_producto',''+producto.id_producto)
      .set('id_linea',''+producto.id_linea)
      .set('producto',''+producto.producto)
      .set('tipo_medida',''+producto.tipo_medida)
      .set('posicion',''+producto.posicion)
      .set('activo',''+producto.activo)
      .set('id_usuario', "" + id_usuario);
    return this.http.post(this.URL, body);
  }

  
  getProducto(id_usuario: number, id_producto:number): Observable<any> {
    return this.http.get<Producto>(this.URL + '?action=getCarProductoById&id_usuario=' + id_usuario + '&id_producto='+id_producto);
  }
}
