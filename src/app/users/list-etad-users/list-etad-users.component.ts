import { Component, OnInit, AfterViewInit } from '@angular/core';
import { User } from '../../models/user';
import { ListEtadUsersService } from './list-etad-users.service';
import { AuthService } from '../../auth/auth.service';

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
  public usuario_selected: User;
  public accion: string;
  public tmpObj:any;

  constructor(private service: ListEtadUsersService,
    private auth: AuthService) { }

  ngOnInit(): void {
    this.service.getEtadUsuarios(this.auth.getIdUsuario()).subscribe(result => {
      if (result.response.sucessfull) {
        this.usuarios_etad = result.data.listUserDTO || [];
        console.log('resultado de etad', result)
      } else {
        Materialize.toast('Ocurrió  un error al consultar usuarios en SONARH!', 4000, 'red');
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

    $('#modalConfirmacion').modal({
      dismissible: false
    });
  }

  ocultarTooltip() {
    $('.tooltipped').tooltip('hide');
  }

  openModalConfirmacion(usuario: User, accion: string, event?: any): void {
    this.mensajeModal = '';
    this.usuario_selected = new User();
    this.accion = '';
    this.tmpObj = null;
    switch (accion) {
      case 'activar':
        this.accion = accion;
        this.usuario_selected = usuario;
        this.usuario_selected.activo = event.target.checked?1:0;
        this.tmpObj = event;
        this.mensajeModal = '¿ESTÁ SEGURO DE ' + (event.target.checked ? ' ACTIVAR ' : ' DESACTIVAR ') + ' A ' + usuario.nombre + ' ? ';
        break;
      case 'eliminar':
        this.accion = accion;       
        this.usuario_selected = usuario;
        this.mensajeModal = '¿ESTÁ SEGURO DE ELIMINAR A ' + usuario.nombre + ' ? ';
        break;
    }
    $('#modalConfirmacion').modal('open');
  }

  closeModal():void {
    debugger
    switch (this.accion) {
      case 'activar':
      this.usuario_selected.activo = !this.usuario_selected.activo?1:0;
      this.tmpObj.target.checked = !this.tmpObj.target.checked;
        break;
      case 'eliminar':
        break;
    }
    $('#modalConfirmacion').modal('close');
  }
}
