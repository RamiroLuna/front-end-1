import { Component, OnInit } from '@angular/core';
import { ANIMATION_PRELOADER } from  './presentacion.animaciones';

@Component({
  selector: 'app-presentacion',
  templateUrl: './presentacion.component.html',
  styleUrls: ['./presentacion.component.css'],
  animations: [ ANIMATION_PRELOADER ]
})
export class PresentacionComponent implements OnInit {

  status: string = 'inactive';

  constructor() { }

  ngOnInit() {
    setTimeout(() => {
      this.status = 'active';
      setTimeout(() => {
        this.status = 'enfasis';
        console.log(this.status)
        setTimeout(()=>{
          this.status = 'inactive';
        },5000);
      }, 7000);
    }, 200);
  }

}
