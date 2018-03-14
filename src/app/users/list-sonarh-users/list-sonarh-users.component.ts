import { Component, AfterViewInit, OnInit } from '@angular/core';
import { UserSonarh } from '../../models/user-sonarh';
import { ListSonarhUsersService } from './list-sonarh-users.service';
import { AuthService } from '../../auth/auth.service';

declare var $: any;
declare var Materialize: any;

@Component({
  selector: 'app-list-sonarh-users',
  templateUrl: './list-sonarh-users.component.html',
  providers: [ListSonarhUsersService]
})

export class ListSonarhUsersComponent implements OnInit, AfterViewInit {


  public usuarios_sonarh: Array<UserSonarh>;
  public id_usuario:number;


  constructor(
      private service:ListSonarhUsersService,
      private auth:AuthService
    ) { }

  ngOnInit(): void {
    this.service.getSonarhUsuarios(this.auth.getIdUsuario()).subscribe(result=>{
      if(result.response.sucessfull){
           this.usuarios_sonarh = result.data.list || [];
      }else{
        Materialize.toast('Ocurrió  un error al consultar usuarios en SONARH!', 4000, 'red');
      }
    },error =>{
      Materialize.toast('Ocurrió  un error en el servicio!', 4000, 'red');
    });

  }

  ngAfterViewInit(): void {

    // $('#tabla_usuarios_sonarh').DataTable({
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
    //     "zeroRecords": "No hay registros",
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

}
