import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { RegistroService } from './registro.service';
import { Router } from '@angular/router';
import { AuthService } from '../../auth/auth.service';
import { Linea } from '../../models/linea';
import { Catalogo } from '../../models/catalogo';
import swal from 'sweetalert2';
import { PetIshikawa } from '../../models/pet-ishikawa';


declare var $: any;
declare var Materialize: any;
@Component({
  selector: 'app-registro',
  templateUrl: './registro.component.html',
  providers: [RegistroService]
})

export class RegistroComponent implements OnInit {

  public loading: boolean;
  public emes: Array<Catalogo>;
  public preguntas: Array<Catalogo>;
  public etads: Array<Catalogo>;
  public grupos: Array<Catalogo>;
  public fecha: string;
  public ishikawa: PetIshikawa;
  public bloquear: boolean;

  constructor(
    private router: Router,
    private auth: AuthService,
    private fb: FormBuilder,
    private service: RegistroService) { }

  ngOnInit() {
    this.loading = true;
    this.ishikawa = new PetIshikawa();
    this.bloquear = false;
    this.fecha = "";
    this.service.init(this.auth.getIdUsuario()).subscribe(result => {
      if (result.response.sucessfull) {
        this.emes = result.data.listMs || [];
        this.preguntas = result.data.listPreguntas || [];
        this.etads = result.data.listEtads || [];
        this.grupos = result.data.listGrupos || [];
        this.fecha = result.data.dia_actual;
        this.loading = false;

      } else {
        this.loading = false;
        Materialize.toast(result.response.message, 4000, 'red');
      }
    }, error => {
      this.loading = false;
      Materialize.toast('Ocurrió un error en el servicio!', 4000, 'red');
    });
  }

  registro(data: any): void {
    this.ishikawa = data.ishikawa;
    /* 
     * Configuración del modal de confirmación
     */
    swal({
      title: '<span style="color: #303f9f ">¿Está seguro de registrar ishikawa?</span>',
      type: 'question',
      html: '<p style="color: #303f9f "> Área: :</b>' + this.etads.filter(el => el.id == this.ishikawa.id_etad)[0].valor + ' </b></p><p> Nombre etad: <b>' + this.ishikawa.nombre_etad + ' </b></p>',
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

        this.service.saveIshikawa(this.auth.getIdUsuario(), this.ishikawa).subscribe(result => {

          if (result.response.sucessfull) {
            this.bloquear = true;
            Materialize.toast(' Se registro correctamente ', 5000, 'green');
          } else {
            Materialize.toast(result.response.message, 4000, 'red');
          }
        }, error => {
          Materialize.toast('Ocurrió  un error en el servicio!', 4000, 'red');
        });
        /*
        * Si cancela accion
        */
      } else if (result.dismiss === swal.DismissReason.cancel) {
      }
    });
  }

}
