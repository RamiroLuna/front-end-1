import { Component, OnInit } from '@angular/core';
import { configChart } from '../../oee/rpt-fuente-perdidas/rpt.config.export';
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

  private TOTAL: number;
  public type_animation: string = 'entrada';
  public steep_index: number = 1;
  public loading: boolean;
  public isOk:boolean;
  public OEE:any;
  public status: string;
  public height: number;

  constructor() { }

  ngOnInit() {
    this.loading = true;
    this.isOk = false;

    this.OEE = localStorage.getItem('OEE');

    if(this.OEE == null || this.OEE === undefined){
      this.loading = false;
    }else{
      this.height = $( window ).height();
      this.OEE = JSON.parse(this.OEE);
      this.TOTAL = this.OEE.length + 1;
      this.isOk = true;
      this.loading = false;
      // Tiene los datos para poder trabajar 
      this.status = 'inactive';
    }

   
  }

  animationDone(event: any): void {
  
    setTimeout(() => {
      
      switch (this.type_animation) {
        case 'entrada':

         if(this.steep_index > 1){
          this.buildChart(this.steep_index);
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

  buildChart(steep:number){
    alert('build paso '+steep)
  }


}
