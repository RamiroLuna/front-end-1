import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-lista-metas',
  templateUrl: './lista-metas.component.html'
})
export class ListaMetasComponent implements OnInit {
  public loading:boolean;

  constructor() { }

  ngOnInit() {
    this.loading = true;
    this.loading = false;
  }

}
