import { Injectable } from '@angular/core';
import { tokenNotExpired } from 'angular2-jwt';
import * as jwt_decode  from 'jwt-decode';

@Injectable()
export class AuthService {
  public getToken(): string {
    return localStorage.getItem('token');
  }
  public isAuthenticated(): boolean {
    // get the token
    const token = this.getToken();
    // return a boolean reflecting 
    // whether or not the token is expired
    return tokenNotExpired(null, token);
    
  }

  public getIdUsuario(): number{
     return jwt_decode(this.getToken()).sub || -1;
     
  }

  public getRolesCUA():string{
    return jwt_decode(this.getToken()).roles_cua || "0";
  }
  public getRolesKpi():string{
    return jwt_decode(this.getToken()).roles_kpi || "0";
  }
  public getRolesIshikawa():string{
    return jwt_decode(this.getToken()).roles_ishikawa || "0";
  }
  public getRolesGenerales():string{
    return jwt_decode(this.getToken()).roles_generales || "0";
  }

  public getId_Grupo():number{
    return jwt_decode(this.getToken()).id_grupo || -1;
  }

  public getId_Linea():number{
    return jwt_decode(this.getToken()).id_linea || -1;
  }
}