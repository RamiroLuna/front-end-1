import { Component, AfterViewInit } from '@angular/core';
import { AuthService } from '../../auth/auth.service';
declare var $: any;
@Component({
  selector: 'app-options',
  templateUrl: './options.component.html'
})
export class OptionsComponent  implements  AfterViewInit{

  public perfil: number;

  constructor(private auth: AuthService) { }

  ngOnInit() {
    this.perfil= this.auth.getPerfil();
  }

  ngAfterViewInit() {
    
    $('.tooltipped').tooltip({delay: 50});
    $('.collapsible').collapsible();
  }

  ocultarTooltip() {
    $('.tooltipped').tooltip('hide');
  }

}
