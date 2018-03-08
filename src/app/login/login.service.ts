import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { ErrorObservable } from 'rxjs/observable/ErrorObservable';
import { catchError, retry } from 'rxjs/operators';
import { BASE_URL_SERVICE } from '../constants'
import { User } from '../models/user';

@Injectable()
export class LoginService {
  private URL = BASE_URL_SERVICE + '/Login';
  
  
  constructor(private http: HttpClient) { }



  login(usuario_acceso:string, clave_accesso:string, id_sistemas:number): Observable<User>{
    //let params= JSON.stringify({action:'Login',usuario_acceso:usuario_acceso,clave_accesso:clave_accesso,id_sistemas:id_sistemas})
    return this.http.post<User>(this.URL, {action : "Login"} );
  }


}
