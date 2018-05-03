import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable()
export class AuthGuardUsers implements CanActivate {
    constructor(public auth: AuthService, public router: Router) { }

    canActivate(route: ActivatedRouteSnapshot): boolean {
        const expectedRole = route.data.expectedRole;
    
        let roles_usuarios = this.auth.getRolesGenerales().split(",").map((el)=>parseInt(el));
    
        if(roles_usuarios.indexOf(expectedRole) == -1){
            this.router.navigate(['home']);
            return false;
        }
        return true;
       
       
    }
}
