import { Component, OnInit } from '@angular/core';
import { 
  ANIMATION_PRELOADER,
  EFECTS_ENFASIS 
} from  './presentacion.animaciones';

@Component({
  selector: 'app-presentacion',
  templateUrl: './presentacion.component.html',
  styleUrls: ['./presentacion.component.css'],
  animations: [ ANIMATION_PRELOADER ]
})
export class PresentacionComponent implements OnInit {

  public status: string = 'inactive';

  constructor() { }

  ngOnInit() {

    setTimeout(() => {
      this.status = 'active';
      setTimeout(() => {
        const EFECT_RANDOM = Math.floor(Math.random() * EFECTS_ENFASIS.length); 
        this.status = EFECTS_ENFASIS[EFECT_RANDOM];
        setTimeout(()=>{
          this.status = 'inactive';
        },5000);
      }, 7000);
    }, 200);
  }

}
