import { Component, OnInit } from '@angular/core';
import { Perfil } from '../../models/perfil';

@Component({
  selector: 'app-details-users',
  templateUrl: './details-users.component.html',
  styles: []
})
export class DetailsUsersComponent implements OnInit {
  
  public perfiles: Array<Perfil> = [
      {id: 1, nombre: 'Administracion', activo: true},
      {id: 2, nombre: 'Contador', activo: true},
      {id: 3, nombre: 'Cliente', activo: true},
      {id: 4, nombre: 'Supervisor', activo: true},
      {id: 5, nombre: 'Gerente', activo: true},
      {id: 6, nombre: 'Consultor', activo: true},
  ]

  constructor() { }

  ngOnInit() {
  }

}
