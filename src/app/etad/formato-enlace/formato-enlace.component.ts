import { Component, OnInit, Input } from '@angular/core';
import { PetReporteEnlace } from '../../models/pet-reporte-enlace';

@Component({
  selector: 'app-formato-enlace',
  templateUrl: './formato-enlace.component.html',
  styleUrls: ['./formato-enlace.component.css']
})
export class FormatoEnlaceComponent implements OnInit {

  @Input() datos: PetReporteEnlace;

  constructor() { }

  ngOnInit() {
    console.log('imprimiendp datos desde el compoente con tabla', this.datos)
  }

}
