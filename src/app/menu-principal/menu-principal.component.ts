import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-menu-principal',
  templateUrl: './menu-principal.component.html',
  styleUrls: ['./menu-principal.component.css']
})
export class MenuPrincipalComponent implements OnInit {

  public menu_cua: boolean;
  public menu_kpi: boolean;
  public menu_ishikawa: boolean;
 
  constructor(private auth: AuthService) { }

  ngOnInit() {
    this.menu_cua = false;
    this.menu_kpi = false;
    this.menu_ishikawa = false;
  
    /* Si no puede ver el menu trae un "0" en la primer posicion del conjunto de roles */
    this.menu_cua = !(this.auth.getRolesOee().split(",")[0] == "0");
    this.menu_kpi = !(this.auth.getRolesKpi().split(",")[0] == "0");
    this.menu_ishikawa = !(this.auth.getRolesIshikawa().split(",")[0] == "0");
   
  }

}
