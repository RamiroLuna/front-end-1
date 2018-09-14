import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-menu-principal',
  templateUrl: './menu-principal.component.html',
  styleUrls: ['./menu-principal.component.css']
})
export class MenuPrincipalComponent implements OnInit {

  public menu_cua: boolean;
  public menu_etad: boolean;
  public menu_ishikawa: boolean;
  public is_user_video_wall: boolean;
 
  constructor(private auth: AuthService) { }

  ngOnInit() {
    this.menu_cua = false;
    this.menu_etad = false;
    this.menu_ishikawa = false;
    this.is_user_video_wall = false;
  
    /* Si no puede ver el menu trae un "0" en la primer posicion del conjunto de roles */
    this.menu_cua = !(this.auth.getRolesOee().split(",")[0] == "0");
    this.menu_etad = !(this.auth.getRolesEtad().split(",")[0] == "0");
    this.is_user_video_wall = (this.auth.getRolesVideoWall().split(",")[0] == "0");
    // this.menu_ishikawa = !(this.auth.getRolesIshikawa().split(",")[0] == "0");
    
    // Si es usuario de video wall desactiva modulo de ishikawa
    this.menu_ishikawa = this.is_user_video_wall;
   
  }

}
