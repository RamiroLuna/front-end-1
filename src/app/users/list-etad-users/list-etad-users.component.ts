import { Component, OnInit, AfterViewInit } from '@angular/core';
import { UserEtad } from '../../models/user-etad';

declare var $:any;

@Component({
  selector: 'app-list-etad-users',
  templateUrl: './list-etad-users.component.html',
  styles: []
})

export class ListEtadUsersComponent implements  AfterViewInit {


  public usuarios_etad: Array<UserEtad> = [
    { id_usuario: 1, id_sonarh: 1, nombre: 'Ivan', apellido_paterno: 'Tadeo', apellido_materno: 'Comboy', clave: '1234567', id_perfil: 1, descripcion_perfil: 'Admin', activo: true, activo_etad: false, departamento: 'produccion', grupo: 'A', linea: '1' , token: '1235565' , contrasenia: '12345'},
  ]

  constructor() { }

  ngAfterViewInit() {
    $('#tabla_usuarios_etad').DataTable({
      "dom": '<lf<t>ip>',
      "responsive": true,
      "scrollX": true,
      "bSort": false,
      "bPaginate": true,
      "bLengthChange": true,
      "lengthChange": true,
      "aLengthMenu": [[10, 25, 50, 75, -1], [10, 25, 50, 75, "Todos"]],
      "iDisplayLength": 10,
      "language": {
        "zeroRecords": "No se encontrarón coincidencias",
        "info": "Mostrando _START_ a _END_ de _TOTAL_ registros",
        "infoEmpty": "Mostrando 0 a 0 de 0 registros",
        "infoFiltered": "(filtrado de _MAX_ total registros)",
        "lengthMenu": "Mostrar _MENU_ regitros",
        "search": "Buscar:",
        "paginate": {
          "first": "Inicio",
          "last": "Fin",
          "next": "Sig.",
          "previous": "Anterior"
        }
      }
    });
    

    $('select').val('10'); //seleccionar valor por defecto del select
    $('select').addClass("browser-default"); //agregar una clase de materializecss de esta forma ya no se pierde el select de numero de registros.
    $('select').material_select();

    $('.tooltipped').tooltip({delay: 50});
  }

  ocultarTooltip(){
    $('.tooltipped').tooltip('hide');
  }
}
