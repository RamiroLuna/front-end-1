import { Component, OnInit } from '@angular/core';
import {
  ANIMATION_PRELOADER,
  EFECTS_ENFASIS
} from './presentacion.animaciones';

declare var $:any;
@Component({
  selector: 'app-presentacion',
  templateUrl: './presentacion.component.html',
  styleUrls: ['./presentacion.component.css'],
  animations: [ANIMATION_PRELOADER]
})
export class PresentacionComponent implements OnInit {

  private TOTAL: number = 3;
  public type_animation: string = 'entrada';
  public steep_index: number = 1;
  public loading: boolean;
  public isOk:boolean;
  public OEE:any;

  public status: string;

  constructor() { }

  ngOnInit() {
    this.loading = true;
    this.isOk = false;

    this.OEE = localStorage.getItem('OEE');

    if(this.OEE == null || this.OEE === undefined){
      this.loading = false;
    }else{
      this.loading = false;
      this.isOk = true;
      // Tiene los datos para poder trabajar 
      this.status = 'inactive';
    }

   
  }

  animationDone(event: any): void {
  
    setTimeout(() => {
      debugger
      switch (this.type_animation) {
        case 'entrada':

         if(this.steep_index > 1){
          setTimeout(()=>{
            this.status = 'active';
            this.type_animation = 'enfasis';
          },200);
         }else{
          this.status = 'active';
          this.type_animation = 'enfasis';
         }
          break;
        case 'enfasis':
          const EFECT_RANDOM = Math.floor(Math.random() * EFECTS_ENFASIS.length);
          this.status = EFECTS_ENFASIS[EFECT_RANDOM];
          this.type_animation = 'salida';
        
          break;
        case 'salida':
          this.status = 'inactive';
          this.type_animation = 'fin';
          break;
        case 'fin':
            if(this.steep_index < this.TOTAL){
              setTimeout(()=>{
                this.steep_index = this.steep_index + 1 ;
                this.status = 'inactive';
                this.type_animation = 'entrada';
              },200);
          
             
            }
             
          break;
      }

    }, 200);

  }


}
