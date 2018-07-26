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
  public perfiles: Array<Catalogo>;
  public grupos: Array<Catalogo>;
  public lineas: Array<Linea>;
  public descripcion_perfiles: string;
  public areas_etads: Array<Catalogo> = [];


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
    this.descripcion_perfiles = "";

    this.route.params.subscribe(params => {
      if (this.auth.getIdUsuario() != null) {
        this.service.miPerfil(this.auth.getIdUsuario()).subscribe(result => {
         
          if (result.response.sucessfull) {
            this.areas_etads = result.data.listEtads || [];
            this.lineas = result.data.listLineas || [];
            this.grupos = result.data.listGrupos || [];
            this.perfiles = result.data.ListPerfiles || [];
            this.usuario = result.data.userETAD || new User();
            this.lineas = this.lineas.filter(el=>el.id_etad == this.usuario.id_etad);
            let perfiles = result.data.userETAD.perfiles.split(",").map(function (item) {
              return parseInt(item);
            });

            this.descripcion_perfiles = "";
            perfiles.forEach((element, index) => {
              if (index > 0) this.descripcion_perfiles += ", ";
              let descripcion = this.perfiles.filter(el => el.id == element)[0].valor;
              this.descripcion_perfiles += descripcion;
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
