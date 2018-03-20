import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-formulario-metas',
  templateUrl: './formulario-metas.component.html'
})
export class FormularioMetasComponent implements OnInit {
  public loading:boolean;
  constructor() { }

  ngOnInit() {
    this.loading = true;
    this.loading = false;
  }

}
