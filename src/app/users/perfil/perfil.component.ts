import { Component, OnInit, AfterViewInit, EventEmitter } from '@angular/core';
import { PerfilService } from './perfil.service';
import { User } from '../../models/user';
import { ActivatedRoute, Router } from '@angular/router';


declare var $: any;

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  providers: [ PerfilService ]
})

export class PerfilComponent implements OnInit, AfterViewInit {

  public cambio_password: boolean;
  public usuario: User;
  public id_perfil: number;

  constructor(
    private service:PerfilService,
    private route: ActivatedRoute,
    private router: Router) {
    this.cambio_password = false;
  }

  ngOnInit() {

    this.route.params.subscribe(params => {
      if(params['id']!=null){
          this.id_perfil = params['id']; 
      }
   });
    console.log('id_que se pasa por parametro', this.id_perfil)
    // this.service.getPerfil(id_perfil).subscribe(result => {

    // });
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
