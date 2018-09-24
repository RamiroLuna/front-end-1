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
  providers: [OptionsService]
})
export class OptionsComponent implements OnInit {

  public disabled = false;

  constructor(
    private service: OptionsService,
    private auth: AuthService,
    private router: Router
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

          if (result.response.sucessfull) {
            let datosOEE = localStorage.getItem('OEE');
            let datosKPI = localStorage.getItem('KPI');
            let posicion = localStorage.getItem('POSICION');
            let enlaceObj = localStorage.getItem('ENLACE_OBJ');
            let posiciones = [];
            posiciones.push(result.data.posicionAnual);
            posiciones.push(result.data.posicionTrimestral);

            if (datosOEE === null || datosOEE == undefined) {
              localStorage.setItem('OEE', JSON.stringify(result.data.OEE));
            } else {
              localStorage.removeItem('OEE');
              localStorage.setItem('OEE', JSON.stringify(result.data.OEE));
            }

            if (posicion === null || posicion == undefined) {
              localStorage.setItem('POSICION', JSON.stringify(posiciones));
            } else {
              localStorage.removeItem('POSICION');
              localStorage.setItem('POSICION', JSON.stringify(posiciones));
            }

            if (datosKPI === null || datosKPI == undefined) {
              localStorage.setItem('KPI', JSON.stringify(result.data.ETAD));
            } else {
              localStorage.removeItem('KPI');
              localStorage.setItem('KPI', JSON.stringify(result.data.ETAD));
            }

            if (enlaceObj === null || enlaceObj == undefined) {
              if (result.data.enlaceObjetivos) {
                localStorage.setItem('ENLACE_OBJ', JSON.stringify(result.data.enlaceObjetivos));
              }
            } else {
              if (result.data.enlaceObjetivos) {
                localStorage.removeItem('ENLACE_OBJ');
                localStorage.setItem('ENLACE_OBJ', JSON.stringify(result.data.enlaceObjetivos));
              }
            }

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
    this.router.navigate(['videowall/presentacion']);
  }

}
