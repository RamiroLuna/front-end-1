import { Component, OnInit, AfterViewInit } from '@angular/core';
import { User } from '../../models/user';
import { ListEtadUsersService } from './list-etad-users.service';
import { AuthService } from '../../auth/auth.service';
import swal from 'sweetalert2';
import { deleteItemArray } from '../../utils';

declare var $: any;
declare var Materialize: any;
@Component({
  selector: 'app-list-etad-users',
  templateUrl: './list-etad-users.component.html',
  providers: [ListEtadUsersService]
})

export class ListEtadUsersComponent implements OnInit, AfterViewInit {


  public usuarios_etad: Array<User> = [];
  public mensajeModal: string;
  public loading: boolean;

  constructor(private service: ListEtadUsersService,
    private auth: AuthService) { }

  ngOnInit(): void {
    this.loading = true;
    this.service.getEtadUsuarios(this.auth.getIdUsuario()).subscribe(result => {
      if (result.response.sucessfull) {
        this.usuarios_etad = result.data.listUserDTO || [];
        this.loading = false;
      } else {
        Materialize.toast('Ocurrió  un error al consultar usuarios ETAD!', 4000, 'red');
        this.loading = false;
      }
    }, error => {
      Materialize.toast('Ocurrió  un error en el servicio!', 4000, 'red');
      this.loading = false;
    });

  }

  ngAfterViewInit() {
    // $('#tabla_usuarios_etad').DataTable({
    //   "dom": '<lf<t>ip>',
    //   "responsive": true,
    //   "scrollX": true,
    //   "bSort": false,
    //   "bPaginate": true,
    //   "bLengthChange": true,
    //   "lengthChange": true,
    //   "aLengthMenu": [[10, 25, 50, 75, -1], [10, 25, 50, 75, "Todos"]],
    //   "iDisplayLength": 10,
    //   "language": {
    //     "zeroRecords": "No se encontrarón coincidencias",
    //     "info": "Mostrando _START_ a _END_ de _TOTAL_ registros",
    //     "infoEmpty": "Mostrando 0 a 0 de 0 registros",
    //     "infoFiltered": "(filtrado de _MAX_ total registros)",
    //     "lengthMenu": "Mostrar _MENU_ regitros",
    //     "search": "Buscar:",
    //     "paginate": {
    //       "first": "Inicio",
    //       "last": "Fin",
    //       "next": "Sig.",
    //       "previous": "Anterior"
    //     }
    //   }
    // });


    // $('select').val('10'); //seleccionar valor por defecto del select
    // $('select').addClass("browser-default"); //agregar una clase de materializecss de esta forma ya no se pierde el select de numero de registros.
    // $('select').material_select();

    $('.tooltipped').tooltip({ delay: 50 });

  }

  ocultarTooltip() {
    $('.tooltipped').tooltip('hide');
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
            this.service.update(this.auth.getIdUsuario(), usuario).subscribe(result => {
              if (result.response.sucessfull) {
                Materialize.toast('Actualización completa', 4000, 'green');

              } else {
                Materialize.toast(result.response.message, 4000, 'red');
                usuario.activo = !usuario.activo?1:0;
              }
            }, error => {
              usuario.activo = !usuario.activo?1:0;
              Materialize.toast('Ocurrió  un error en el servicio!', 4000, 'red');
            });
            break;
          case 'eliminar':
            this.service.delete(this.auth.getIdUsuario(), usuario.id_usuario).subscribe(result => {
              if (result.response.sucessfull) {
                deleteItemArray(this.usuarios_etad, usuario.id_usuario, 'id_usuario');
                Materialize.toast('Se eliminó correctamente ', 4000, 'green');
              } else {
                Materialize.toast(result.response.message, 4000, 'red');
              }
            }, error => {
              Materialize.toast('Ocurrió  un error en el servicio!', 4000, 'red');
            });
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
}
