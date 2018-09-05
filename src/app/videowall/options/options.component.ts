import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import swal from 'sweetalert2';
import { OptionsService } from './options.service';


declare var $: any;
declare var Materialize: any;
@Component({
  selector: 'app-options',
  templateUrl: './options.component.html',
  providers: [ OptionsService ]
})
export class OptionsComponent implements OnInit {

  constructor( private service: OptionsService) { }

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

       
        // this.service.agregar(this.auth.getIdUsuario()).subscribe(result => {

        //   if (result.response.sucessfull) {
        //     this.btnAdd = false;

        //     Materialize.toast('Producción registrada', 4000, 'green');

        //   } else {
        //     Materialize.toast(result.response.message, 4000, 'red');
        //   }
        // }, eror => {
        //   Materialize.toast('Ocurrió un error en el servicio!', 4000, 'red');
        // });

        /*
        * Si cancela accion
        */
      } else if (result.dismiss === swal.DismissReason.cancel) {

      }
    })
  }

  viewVideoWall(): void {
    alert('video wall')
  }

}
