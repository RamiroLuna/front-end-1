import { Component, AfterViewInit } from '@angular/core';
import { User } from '../../models/user';

declare var $:any;

@Component({
  selector: 'app-list-sonarh-users',
  templateUrl: './list-sonarh-users.component.html',
  styles: []
})

export class ListSonarhUsersComponent  implements  AfterViewInit  {

  public usuarios_sonarh: Array<User> = [
    { id_usuario: 1, id_sonarh: 1, nombre: 'Ivan', apellido_paterno: 'Tadeo', apellido_materno: 'Comboy', clave: '1234567', id_perfil: 1, descripcion_perfil: 'Admin', activo: true, activo_etad: false, departamento:'produccion', grupo: 'A', linea:'1'},
    { id_usuario: 2, id_sonarh: 1, nombre: 'Luis', apellido_paterno: 'Reyes', apellido_materno: 'Aguiar', clave: '1234567', id_perfil: 1, descripcion_perfil: 'Consultor', activo: true, activo_etad: true, departamento:'produccion', grupo: 'A', linea:'1'},
    { id_usuario: 3, id_sonarh: 1, nombre: 'Hugo', apellido_paterno: 'Gomez', apellido_materno: 'Ramirez', clave: '1234567', id_perfil: 1, descripcion_perfil: 'Consultor', activo: true, activo_etad: false, departamento:'produccion', grupo: 'A', linea:'1'},
    { id_usuario: 4, id_sonarh: 1, nombre: 'Ramiro', apellido_paterno: 'Toledo', apellido_materno: 'Pedraza', clave: '1234567', id_perfil: 1, descripcion_perfil: 'Consultor', activo: true, activo_etad: false, departamento:'produccion', grupo: 'A', linea:'1'},
    { id_usuario: 5, id_sonarh: 1, nombre: 'Sergio', apellido_paterno: 'Tadeo', apellido_materno: 'Piedra', clave: '1234567', id_perfil: 1, descripcion_perfil: 'Consultor', activo: true, activo_etad: true, departamento:'produccion', grupo: 'A', linea:'1'},
    { id_usuario: 6, id_sonarh: 1, nombre: 'Pedro', apellido_paterno: 'Martinez', apellido_materno: 'Mendez', clave: '1234567', id_perfil: 1, descripcion_perfil: 'Consultor', activo: true, activo_etad: false, departamento:'produccion', grupo: 'A', linea:'1'},
    { id_usuario: 7, id_sonarh: 1, nombre: 'Pablo', apellido_paterno: 'Tadeo', apellido_materno: 'Perez', clave: '1234567', id_perfil: 1, descripcion_perfil: 'Consultor', activo: true, activo_etad: false, departamento:'produccion', grupo: 'A', linea:'1'},
    { id_usuario: 8, id_sonarh: 1, nombre: 'Juan', apellido_paterno: 'Campos', apellido_materno: 'Ibarra', clave: '1234567', id_perfil: 1, descripcion_perfil: 'Consultor', activo: true, activo_etad: false, departamento:'produccion', grupo: 'A', linea:'1'},
    { id_usuario: 9, id_sonarh: 1, nombre: 'Miguel', apellido_paterno: 'Tadeo', apellido_materno: 'Salazar', clave: '1234567', id_perfil: 1, descripcion_perfil: 'Consultor', activo: true, activo_etad: true, departamento:'produccion', grupo: 'A', linea:'1'},
    { id_usuario: 10, id_sonarh: 1, nombre: 'Francisco', apellido_paterno: 'Garcia', apellido_materno: 'Vergel', clave: '1234567', id_perfil: 1, descripcion_perfil: 'Consultor', activo: true, activo_etad: false, departamento:'produccion', grupo: 'A', linea:'1'}
  ]


  constructor() { }

  ngAfterViewInit() {

    $('#tabla_usuarios_sonarh').DataTable({
      "dom": '<lf<t>ip>',
      "responsive": true,
      "scrollX": true,
      "bSort" : false,
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
