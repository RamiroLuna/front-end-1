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

  private TOTAL: number = 3;
  // public status: string = 'inactive';
  public type_animation: string = 'entrada';
  public steep_index: number = 1;

  public stepp_status: any = {
    1: '',
    2: '',
    3: '',
  }

  constructor() { }

  ngOnInit() {
    this.stepp_status[this.steep_index] = 'inactive';
  }

  animationStart(event: any): void {
    
  }

  animationDone(event: any): void {
  
    setTimeout(() => {

      switch (this.type_animation) {
        case 'entrada':
          this.stepp_status[this.steep_index] = 'active';
          this.type_animation = 'enfasis';
        
          break;
        case 'enfasis':
          const EFECT_RANDOM = Math.floor(Math.random() * EFECTS_ENFASIS.length);
          this.stepp_status[this.steep_index] = EFECTS_ENFASIS[EFECT_RANDOM];
          this.type_animation = 'salida';
      
          break;
        case 'salida':
          this.stepp_status[this.steep_index] = 'inactive';
          this.type_animation = 'fin';
          break;
        case 'fin':
            if(this.steep_index < this.TOTAL){
            
              setTimeout(()=>{
                this.steep_index = this.steep_index + 1 ;
                this.stepp_status[this.steep_index] = 'active';
                this.type_animation = 'entrada';
               
              },20);
          
             
            }
             
          break;
      }

    }, 200);

  }


}
