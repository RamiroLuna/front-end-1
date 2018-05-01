import { Component, OnInit, EventEmitter } from '@angular/core';
import { PerfilService } from './perfil.service';
import { AuthService } from '../../auth/auth.service';
import { User } from '../../models/user';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { Catalogo } from '../../models/catalogo';
import { Linea } from '../../models/linea';


declare var $: any;
declare var Materialize: any;

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  providers: [PerfilService]
})

export class PerfilComponent implements OnInit {

  public usuario: User;
  public mensaje_error: string;
  public loading: boolean;
  public perfiles: Array<Catalogo> ;
  public grupos: Array<Catalogo>;
  public lineas: Array<Linea>;



  constructor(
    private service: PerfilService,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router) {
  }

  ngOnInit(): void {
    this.loading = true;
    this.lineas = [];
    this.grupos = [];
    this.perfiles = [];

    this.route.params.subscribe(params => {
      if (this.auth.getIdUsuario() != null) {
        this.service.miPerfil(this.auth.getIdUsuario()).subscribe(result => {
          console.log('result', result)
          if (result.response.sucessfull) {
           
            this.lineas =  result.data.listLineas || [];
            this.grupos =  result.data.listGrupos || [] ;
            this.perfiles = result.data.ListPerfiles || [];
            this.usuario = result.data.userETAD || new User();
            let perfiles = result.data.userETAD.perfiles.split(",").map(function (item) {
              return parseInt(item);
            });

            this.usuario.id_perfiles = perfiles;            
            this.loading = false;
          } else {
            Materialize.toast(result.response.message, 4000, 'red');
            this.loading = false;
          }
        }, error => {
          Materialize.toast('Ocurrió  un error en el servicio!', 4000, 'red');
          this.loading = false;
        }
        );
      }
    });
  }

  regresar() {
    $('.tooltipped').tooltip('hide');
  }


}
