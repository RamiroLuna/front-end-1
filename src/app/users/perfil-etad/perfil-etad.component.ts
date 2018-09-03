import { Component, OnInit, AfterViewInit, EventEmitter } from '@angular/core';
import { PerfilEtadService } from './perfil-etad.service';
import { AuthService } from '../../auth/auth.service';
import { User } from '../../models/user';
import { Catalogo } from '../../models/catalogo';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import swal from 'sweetalert2';
import { Linea } from '../../models/linea';

declare var $: any;
declare var Materialize: any;

@Component({
  selector: 'app-perfil-etad',
  templateUrl: './perfil-etad.component.html',
  providers: [PerfilEtadService]
})
export class PerfilEtadComponent implements OnInit {

  public usuario: User;
  public loading: boolean;
  public formPerfilEtad: FormGroup;
  public submitted: boolean;
  public usuario_en_etad: boolean;

  public perfiles: Array<Catalogo> = [];
  public grupos: Array<Catalogo> = [];
  public lineas: Array<Linea> = [];
  public areas_etads: Array<Catalogo> = [];
  public lineas_disponibles: Array<Linea> = [];

  constructor(
    private auth: AuthService,
    private service: PerfilEtadService,
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder
  ) { }

  ngOnInit() {

    this.loading = true;
    this.usuario_en_etad = false;

    this.route.paramMap.subscribe(params => {
      let id_usuario_etad = parseInt(params.get('id'));
      this.service.getPerfilEtad(this.auth.getIdUsuario(), id_usuario_etad).subscribe(result => {
    
        if (result.response.sucessfull) {
          this.areas_etads = result.data.listEtads || [];
          this.perfiles = result.data.ListPerfiles || [];
          this.lineas_disponibles = result.data.listLineas || [];
          this.grupos = result.data.listGrupos || [];
          this.usuario = result.data.userETAD || new User();
          this.lineas = this.lineas_disponibles.filter(el=>el.id_etad == this.usuario.id_etad);
          let perfiles = result.data.userETAD.perfiles.split(",").map(function (item) {
            return parseInt(item);
          });
          this.usuario.id_perfiles = perfiles;

          this.usuario_en_etad = true;
          this.loading = false;
          this.loadFormulario();
        } else {
          Materialize.toast(result.response.message, 4000, 'red');
          this.loading = false;
          this.usuario_en_etad = false;
        }
      }, error => {
        Materialize.toast('Ocurrió un error en el servicio!', 4000, 'red');
        this.loading = false;
        this.usuario_en_etad = false;
      });
    });
  }


  loadFormulario(): void {
    this.formPerfilEtad = this.fb.group({
      nombre: new FormControl({ value: this.usuario.nombre, disabled: true }, [Validators.required]),
      usuario_sonarh: new FormControl({ value: this.usuario.usuario_sonarh, disabled: true }, [Validators.required]),
      id_grupo: new FormControl({ value: this.usuario.id_grupo, disabled: true }, [Validators.required]),
      id_linea: new FormControl({ value: this.usuario.id_linea, disabled: false }, [Validators.required]),
      id_perfiles: new FormControl({ value: this.usuario.id_perfiles, disabled: false }, [Validators.required]),
      id_etad: new FormControl({ value: this.usuario.id_etad }, [Validators.required])
    });
  }

  modalConfirmacion(usuario: User): void {

    this.submitted = true;

    if (this.formPerfilEtad.valid) {
      /* 
          * Configuración del modal de confirmación
          */
      swal({
        title: '<span style="color: #303f9f "> ¿ Está seguro de actualizar información ?</span>',
        type: 'question',
        // html: '<p style="color: #303f9f "> Usuario: <b>' + usuario.nombre + ' </b></p>',
        showCancelButton: true,
        confirmButtonColor: '#303f9f',
        cancelButtonColor: '#9fa8da ',
        cancelButtonText: 'Cancelar',
        confirmButtonText: 'Si!',
        allowOutsideClick: false,
        allowEnterKey: false
      }).then((result) => {
        /*
         * Si acepta
         */
        if (result.value) {

          this.submitted = false;

          this.service.update(this.auth.getIdUsuario(), usuario).subscribe(
            result => {


              if (result.response.sucessfull) {

                Materialize.toast('Actualización exitosa!', 4000, 'green');

              } else {
                Materialize.toast(result.response.message, 4000, 'red');
              }
            }, error => {
              Materialize.toast('Ocrrió error en el servicio', 4000, 'red');
            }
          );
          /*
          * Si cancela accion
          */
        } else if (result.dismiss === swal.DismissReason.cancel) {

        }
      })
    } else {
      Materialize.toast('Verifique los datos capturados!', 4000, 'red');
    }

  }

  filtraLineas(id_etad: number): void {

    if (id_etad == undefined || id_etad == 0 || id_etad == 8 ) {
    
      let i = this.usuario.id_perfiles.indexOf(4);
      if (i != -1) {
        this.usuario.id_perfiles.splice(i, 1);
      }

      let j = this.usuario.id_perfiles.indexOf(5);
      if (j != -1) {
        this.usuario.id_perfiles.splice(j, 1);
      }

      $('#option4, #option5').removeAttr("selected");
      $('#option4, #option5').prop("disabled", true);

    } else {
      $('#option4, #option5').prop("disabled", false);

    }
   

    $('.perfi').material_select('destroy');
    $('.perfi').material_select();
    
    this.lineas = this.lineas_disponibles.filter(el => el.id_etad == id_etad);
    this.formPerfilEtad.controls.id_linea.reset();
  }

}
