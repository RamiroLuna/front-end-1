import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { ErrorObservable } from 'rxjs/observable/ErrorObservable';
import { catchError, retry } from 'rxjs/operators';
import { BASE_URL_SERVICE } from '../constants'

@Injectable()
export class LoginService {
  private URL = BASE_URL_SERVICE + '/Login';

  constructor(private http: HttpClient) { }

  getAll(): Observable<any[]>{
    return this.http.get<any[]>(this.URL);
  }


}
