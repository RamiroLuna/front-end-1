import { Component, OnInit, AfterViewInit } from '@angular/core';
import { User } from '../../models/user';
import { ListEtadUsersService } from './list-etad-users.service';
import { AuthService } from '../../auth/auth.service';
import swal from 'sweetalert2'

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

  constructor(private service: ListEtadUsersService,
    private auth: AuthService) { }

  ngOnInit(): void {
    this.service.getEtadUsuarios(this.auth.getIdUsuario()).subscribe(result => {
      if (result.response.sucessfull) {
        this.usuarios_etad = result.data.listUserDTO || [];
      } else {
        Materialize.toast('Ocurrió  un error al consultar usuarios ETAD!', 4000, 'red');
      }
    }, error => {
      Materialize.toast('Ocurrió  un error en el servicio!', 4000, 'red');
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
        this.mensajeModal = '¿Está seguro de eliminar ? ';
        break;
    }

    swal({
      title: '<span style="color: #303f9f ">'+this.mensajeModal+'</span>' ,
      type: 'question',
      html: '<p style="color: #303f9f "> Usuario: <b>'+ usuario.nombre +' </b></p>',
      showCancelButton: true,
      confirmButtonColor: '#303f9f',
      cancelButtonColor: '#9fa8da ',
      cancelButtonText: 'Cancelar',
      confirmButtonText: 'Si!',
      allowOutsideClick: false,
      allowEnterKey: false
    }).then(function (result) {
       
      if (result.value) {
              alert('ok acccion')
      } else if (result.dismiss === swal.DismissReason.cancel) {
          switch(accion){
            case 'activar':
            usuario.activo = !usuario.activo?1:0;
            event.target.checked = !event.target.checked;
            break;
          }
        
        }
    })

  }
}
