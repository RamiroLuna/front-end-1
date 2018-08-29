import { Component, OnInit } from '@angular/core';
import {
  trigger,
  state,
  style,
  animate,
  transition,
  keyframes
} from '@angular/animations';

@Component({
  selector: 'app-presentacion',
  templateUrl: './presentacion.component.html',
  styleUrls: ['./presentacion.component.css'],
  animations: [
    trigger('visibility', [
      state('inactive', style({
        transform: 'scale(.1)',
        opacity: 0,
        display: 'none'
      })),
      state('active', style({
        transform: 'scale(1)',
        opacity: 1,
        display: 'block',
      })),
      // state('enfasis', style({
      //   transform: 'scale(1)',
      // })),
     
      /* Primer ejemplo */
      // transition('inactive => active', animate('1000ms ease-in')),
      // transition('active => inactive', animate('1000ms ease-in')),

      /* Segundo ejemplo */
      // transition('active <=> inactive', animate('1000ms ease-out', style({
      //   transform: 'rotateX(-45deg)'
      // })))

      /* tercer ejemplo */
      // transition('active <=> inactive', animate('5000ms ease-out', keyframes([
      //   style({ opacity: 0, transform: 'rotateY(-90deg)', offset: 0.5 }),
      //   style({ opacity: 1, transform: 'rotateY(-180deg)', offset: 0.7 }),
      //   style({ opacity: 1, transform: 'rotateY(-270deg)', offset: 0.9 }),
      //   style({ opacity: 1, transform: 'rotateY(-360deg)', offset: 1 })
      // ])))

      /* Pruebas */
      transition('inactive => active', animate('2000ms')),
      transition('active => enfasis', animate('4000ms', keyframes([
        style({ opacity: 1, transform: 'rotateY(-90deg)', offset: 0.5 }),
        style({ opacity: 1, transform: 'rotateY(-180deg)', offset: 0.7 }),
        style({ opacity: 1, transform: 'rotateY(-270deg)', offset: 0.9 }),
        style({ opacity: 1, transform: 'rotateY(-360deg)', offset: 1 })
      ]))),
      transition('enfasis => inactive', animate('2000ms'))

    ])
  ]
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
