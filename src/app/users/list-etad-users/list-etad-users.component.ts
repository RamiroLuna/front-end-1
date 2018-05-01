import { Component, OnInit } from '@angular/core';
import { User } from '../../models/user';
import { ListEtadUsersService } from './list-etad-users.service';
import { AuthService } from '../../auth/auth.service';
import swal from 'sweetalert2';
import { deleteItemArray, DataTable, contraseniaValida } from '../../utils';

declare var $: any;
declare var Materialize: any;
@Component({
  selector: 'app-list-etad-users',
  templateUrl: './list-etad-users.component.html',
  providers: [ListEtadUsersService]
})

export class ListEtadUsersComponent implements OnInit {


  public usuarios_etad: Array<User> = [];
  public mensajeModal: string;
  public loading: boolean;

  constructor(private service: ListEtadUsersService,
    private auth: AuthService) { }

  ngOnInit(): void {
    this.loading = true;
    this.service.getEtadUsuarios(this.auth.getIdUsuario()).subscribe(result => {
      console.log('resultados', result)
      if (result.response.sucessfull) {
        this.usuarios_etad = result.data.listUserETAD || [];
        this.loading = false;
        setTimeout(() => { this.ngAfterViewHttp() }, 200)
      } else {
        Materialize.toast('Ocurrió  un error al consultar usuarios ETAD!', 4000, 'red');
        this.loading = false;
      }
    }, error => {
      Materialize.toast('Ocurrió  un error en el servicio!', 4000, 'red');
      this.loading = false;
    });

  }


  ocultarTooltip() {
    $('.tooltipped').tooltip('hide');
  }


  /*
   * Carga plugins despues de cargar y mostrar objetos en el DOM
   */
  ngAfterViewHttp(): void {

    DataTable('#tabla_usuarios_etad');

    $('.tooltipped').tooltip({ delay: 50 });
  }



  openModalConfirmacion(usuario: User, accion: string, event?: any): void {
    this.mensajeModal = '';

    switch (accion) {
      case 'activar':
        usuario.activo = event.target.checked ? 1 : 0;
        this.mensajeModal = '¿Está seguro de ' + (event.target.checked ? ' activar ' : ' desactivar ') + ' ? ';
        break;
      case 'eliminar':
        this.mensajeModal = '¿Está seguro de eliminar? ';
        break;
    }


    /* 
     * Configuración del modal de confirmación
     */
    swal({
      title: '<span style="color: #303f9f ">' + this.mensajeModal + '</span>',
      type: 'question',
      html: '<p style="color: #303f9f "> Usuario: <b>' + usuario.nombre + ' </b></p>',
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
        switch (accion) {
          case 'activar':
            this.service.update(this.auth.getIdUsuario(), usuario.id_acceso, usuario.activo).subscribe(result => {
              if (result.response.sucessfull) {
                Materialize.toast('Actualización completa', 4000, 'green');
              } else {
                Materialize.toast(result.response.message, 4000, 'red');
                usuario.activo = !usuario.activo ? 1 : 0;
              }
            }, error => {
              usuario.activo = !usuario.activo ? 1 : 0;
              Materialize.toast('Ocurrió  un error en el servicio!', 4000, 'red');
            });
            break;
          case 'eliminar':

            break;
        }
        /*
        * Si cancela accion
        */
      } else if (result.dismiss === swal.DismissReason.cancel) {
        switch (accion) {
          case 'activar':
            usuario.activo = !usuario.activo ? 1 : 0;
            event.target.checked = !event.target.checked;
            break;
        }

      }
    })

  }

  openModalPassword(usuario: User, event?: any): void {

    swal({
      title: '<h6  style="color: #303f9f">CAMBIAR CONTRASEÑA A: <br><b>' + usuario.nombre + '</b></h6>',
      input: 'password',
      inputPlaceholder: 'Escribe',
      showCancelButton: true,
      confirmButtonColor: '#303f9f',
      cancelButtonColor: '#9fa8da ',
      cancelButtonText: 'Cancelar',
      confirmButtonText: 'Cambiar',
      allowOutsideClick: false,
      allowEnterKey: false,
      inputValidator: (value) => {
        return !contraseniaValida(value) && 'La contraseña debe tener al entre 6 y 10 caracteres. Al menos un dígito, una mayuscula y minúscula';
      }
    }).then((result) => {
    
      if (result.value) {
        this.service.changePasswordUser(this.auth.getIdUsuario(), usuario.id_acceso,result.value).subscribe(result => {
          if (result.response.sucessfull) {
            Materialize.toast('Contraseña actualizada', 4000, 'green');
          } else {
            Materialize.toast(result.response.message, 4000, 'red');
           
          }
        }, error => {
        
          Materialize.toast('Ocurrió  un error en el servicio!', 4000, 'red');
        });

      }else if (result.dismiss === swal.DismissReason.cancel) {
       
      }

    })
  }
}
