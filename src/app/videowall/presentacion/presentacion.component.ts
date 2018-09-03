import { Component, OnInit } from '@angular/core';
import {
  ANIMATION_PRELOADER,
  EFECTS_ENFASIS
} from './presentacion.animaciones';

@Component({
  selector: 'app-presentacion',
  templateUrl: './presentacion.component.html',
  styleUrls: ['./presentacion.component.css'],
  animations: [ANIMATION_PRELOADER]
})
export class PresentacionComponent implements OnInit {

  public status: string = 'inactive';
  public type_animation: string = 'entrada';

  constructor() { }

  ngOnInit() {

  }

  animationDone(event: any): void {
    setTimeout(() => {

      switch (this.type_animation) {
        case 'entrada':
          this.status = 'active';
          this.type_animation = 'enfasis';
          break;
        case 'enfasis':
          const EFECT_RANDOM = Math.floor(Math.random() * EFECTS_ENFASIS.length);
          this.status = EFECTS_ENFASIS[EFECT_RANDOM];
          this.type_animation = 'salida';
          break;
        case 'salida':
          this.status = 'inactive';
          this.type_animation = 'entrada';
          break;

      }

    }, 200);

  }

}
