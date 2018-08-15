import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { RegistroService } from './registro.service';
import { Router } from '@angular/router';
import { AuthService } from '../../auth/auth.service';
import { Linea } from '../../models/linea';
import { Catalogo } from '../../models/catalogo';
import swal from 'sweetalert2';


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
  public fecha:string;

  constructor(
    private router: Router,
    private auth: AuthService,
    private fb: FormBuilder,
    private service: RegistroService) { }

  ngOnInit() {
    this.loading = true;
    this.fecha = "";
    this.service.init(this.auth.getIdUsuario()).subscribe(result => {
      console.log('init ishikawa', result)
      if (result.response.sucessfull) {
        this.emes = result.data.listMs || [];
        this.preguntas = result.data.listPreguntas || [];
        this.etads = result.data.listEtads || [];
        this.grupos = result.data.listGrupos || [];
        this.fecha = result.data.dia_actual;
        this.loading = false;

        // setTimeout(() => this.ngAfterViewInit(), 20);
      } else {
        this.loading = false;
        Materialize.toast(result.response.message, 4000, 'red');
      }
    }, error => {
      this.loading = false;
      Materialize.toast('Ocurrió un error en el servicio!', 4000, 'red');
    });
  }

}
