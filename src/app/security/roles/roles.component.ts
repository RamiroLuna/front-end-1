import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../auth/auth.service';
import { deleteItemArray, isValidId } from '../../utils';
import swal from 'sweetalert2';
import { Catalogo } from '../../models/catalogo';
import { SecurityService } from '../security.service';
import { Roles } from '../../models/roles';

declare var $: any;
declare var Materialize: any;
@Component({
  selector: 'app-roles',
  templateUrl: './roles.component.html',
  providers: [SecurityService]
})
export class RolesComponent implements OnInit {

  public perfil: Catalogo;
  public roles: Array<Roles>;
  public roles_asignados: Array<Catalogo>;
  public isCorrecto:boolean;
  public loading: boolean;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private service: SecurityService,
    private auth: AuthService
  ) { }

  ngOnInit() {

    this.loading = true;
    this.isCorrecto = true;

    this.route.paramMap.subscribe(params => {

      if (isValidId(params.get('id_perfil'))) {
        this.service.getRolesByPerfil(this.auth.getIdUsuario(), params.get('id_perfil')).subscribe(result => {
        
          if (result.response.sucessfull) {
            this.perfil = result.data.catalogosDTO || new Catalogo();
            this.roles = result.data.listAllRolles;
            this.roles_asignados = result.data.rolesByPerfil;

            this.loading = false;
            setTimeout(() => { this.ngAfterViewHttp(); }, 200)
          } else {

            this.loading = false;
            Materialize.toast(result.response.message, 4000, 'red');
          }
        }, error => {

          this.loading = false;
          Materialize.toast('Ocurrió un error en el servicio!', 4000, 'red');
        });
      }else{
        this.isCorrecto = false;
        this.loading = false;
      }
    });



  }

  /*
  * Carga plugins despues de cargar y mostrar objetos en el DOM
  */
  ngAfterViewHttp(): void {
    $('.tooltipped').tooltip({ delay: 50 });
  }

  /*
  * Inicia codigo para la funcionalidad del componente
  */

  agregar() {
    $('.tooltipped').tooltip('hide');
  }

  regresar() {
    $('.tooltipped').tooltip('hide');
  }

  
  isChekedRol(id_rol: number): boolean {
    let arg = this.roles_asignados.map(el=>el.id);
    if (arg.length > 0) {      
      return arg.includes(id_rol);
    } else {
      return false;
    }

  }

}
