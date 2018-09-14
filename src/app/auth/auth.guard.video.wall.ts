import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable()
export class AuthGuardVideoWall implements CanActivate {
    constructor(public auth: AuthService, public router: Router) { }

    canActivate(route: ActivatedRouteSnapshot): boolean {
        const expectedRole = route.data.expectedRole;
    
        let roles_video_wall= this.auth.getRolesVideoWall().split(",").map((el)=>parseInt(el));
    
        if(roles_video_wall.indexOf(expectedRole) == -1){
            this.router.navigate(['home']);
            return false;
        }
        return true;
       
       
    }
}
