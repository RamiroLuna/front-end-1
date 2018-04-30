import { Component, OnInit } from '@angular/core';
import { Catalogo } from '../../models/catalogo';
import { UserSonarh } from '../../models/user-sonarh';
import { AuthService } from '../../auth/auth.service';
import { PerfilSonarhService } from './perfil-sonarh.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { Linea } from '../../models/linea';

declare var $: any;
declare var Materialize: any;
@Component({
  selector: 'app-details-users',
  templateUrl: './perfil-sonarh.component.html',
  providers: [PerfilSonarhService]
})
export class PerfilSonarhComponent implements OnInit {

  public usuario: UserSonarh;
  public loading: boolean;
  public perfiles: Array<Catalogo> = [];
  public grupos: Array<Catalogo> = [];
  public lineas: Array<Linea> = [];
  public formPerfilSonarh: FormGroup;
  public submitted: boolean;
  public usuario_en_etad: boolean;
  public existe_user:boolean;

  constructor(
    private auth: AuthService,
    private service: PerfilSonarhService,
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder
  ) { }

  ngOnInit() {
    this.existe_user = false;
    this.loading = true;
    this.usuario_en_etad = false;


    this.route.paramMap.subscribe(params => {
    
      let numero_empleado = parseInt(params.get('id'));
      this.service.getDetalleUsuarioSonarh(this.auth.getIdUsuario(), numero_empleado).subscribe(result => {
          
        if (result.response.sucessfull) {
          if(result.data.usuarioSonarh){
            this.grupos = result.data.listGrupos || [];
            this.perfiles = result.data.listPerfiles || [];
            this.lineas = result.data.listLineas || [];
            this.usuario = result.data.usuarioSonarh || new UserSonarh();
            /* Por default es consulta */
            this.usuario.id_perfiles = [6];
            
            this.usuario_en_etad = false;
            this.existe_user=true;
            this.loading = false;
            this.loadFormulario();
          }else{
            this.loading = false;
            this.existe_user=false;
          }

        } else {
          Materialize.toast(result.response.message, 4000, 'red');
          this.loading = false;
          this.usuario_en_etad = true;
        }
      }, error => {
        Materialize.toast('Ocurrió un error en el servicio!', 4000, 'red');
        this.loading = false;
        this.usuario_en_etad = false;
      });
    });

  }
  
  
  
  
  
  

  loadFormulario(): void {
    this.formPerfilSonarh = this.fb.group({
      nombre: new FormControl({value: this.usuario.Nombre, disabled:true}, [Validators.required]),
      NumEmpleado: new FormControl({value: this.usuario.NumEmpleado, disabled:true}, [Validators.required]),
      Area: new FormControl({value: this.usuario.Area, disabled:true}, [Validators.required]),
      id_grupo: new FormControl({value: this.usuario.id_grupo, disabled:true}, [Validators.required]),
      id_linea: new FormControl({value: this.usuario.id_linea}, [Validators.required]),
      id_perfiles: new FormControl({value: this.usuario.id_perfiles}, [Validators.required])

    });
  }


  modalConfirmacion(usuario: UserSonarh) {
    console.log(usuario)
    this.submitted = true;
    if (this.formPerfilSonarh.valid) {

      this.service.altaUsuario(this.auth.getIdUsuario(), usuario).subscribe(
        result => {
          this.submitted = false;

          if (result.response.sucessfull) {

            Materialize.toast('Alta exitosa!', 4000, 'green');
            this.router.navigate(['home/usuarios/etad']);

          } else {
            Materialize.toast(result.response.message, 4000, 'red');
          }
        }, error => {
          Materialize.toast('Ocrrió error en el servicio', 4000, 'red');
        }
      );
    }
    else {
      Materialize.toast('Verifique los datos capturados!', 4000, 'red');
    }


  }




}
