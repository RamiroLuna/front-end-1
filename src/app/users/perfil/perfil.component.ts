import { Component, OnInit, AfterViewInit, EventEmitter } from '@angular/core';


declare var $: any;

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styles: []
})
export class PerfilComponent implements OnInit, AfterViewInit {

  public cambio_password: boolean;

  constructor() {
    this.cambio_password = false;
  }

  ngOnInit() {
  }

  ngAfterViewInit() {
    $('#modal_cambio_password').modal({
      dismissible: false
    });
  }

  onChangePassword() {
    this.cambio_password = !this.cambio_password;
    $('#modal_cambio_password').modal('open');
  }

  closeModal() {
    this.cambio_password = false;
    $('#modal_cambio_password').modal('close');
  }

}
