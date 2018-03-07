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



  login(datos: any){
    return this.http.post(this.URL, datos);
  }


}
