import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import swal from 'sweetalert2';
import { OptionsService } from './options.service';
import { AuthService } from '../../auth/auth.service';


declare var $: any;
declare var Materialize: any;
@Component({
  selector: 'app-options',
  templateUrl: './options.component.html',
  providers: [ OptionsService ]
})
export class OptionsComponent implements OnInit {

  public disabled = false;

  constructor(
    private service: OptionsService,
    private auth: AuthService,
  ) { }

  ngOnInit() {
  }

  refreshData(): void {
  
    /* 
    * Configuración del modal de confirmación
    */
    swal({
      title: '<span style="color: #303f9f "> ¿ Actualizar datos ? </span>',
      type: 'question',
      showCancelButton: true,
      confirmButtonColor: '#303f9f',
      cancelButtonColor: '#9fa8da ',
      cancelButtonText: 'Cancelar',
      confirmButtonText: 'Si',
      allowOutsideClick: false,
      allowEnterKey: false
    }).then((result) => {
      /*
       * Si acepta
       */
      if (result.value) {
        this.disabled = true;
        
        this.service.generateVideoWall(this.auth.getIdUsuario()).subscribe(result => {
          console.log('result', result)
          if (result.response.sucessfull) {
            Materialize.toast('Actualización correcta', 4000, 'green');
            this.disabled = false;
          } else {
            Materialize.toast(result.response.message, 4000, 'red');
            this.disabled = false;
          }
        }, eror => {
          Materialize.toast('Ocurrió un error en el servicio!', 4000, 'red');
          this.disabled = false;
        });

        /*
        * Si cancela accion
        */
      } else if (result.dismiss === swal.DismissReason.cancel) {
        this.disabled = false;
      }
    })
  }

  viewVideoWall(): void {
    alert('video wall')
  }

}
