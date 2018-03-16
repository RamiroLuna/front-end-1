import { Component, AfterViewInit } from '@angular/core';
declare var $: any;
@Component({
  selector: 'app-options',
  templateUrl: './options.component.html'
})
export class OptionsComponent  implements  AfterViewInit{

  constructor() { }

  ngOnInit() {
  }

  ngAfterViewInit() {
    
    $('.tooltipped').tooltip({delay: 50});
    $('.collapsible').collapsible();
  }

  ocultarTooltip() {
    $('.tooltipped').tooltip('hide');
  }

}
