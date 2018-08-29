import { animate, state, style, transition, trigger, keyframes } from '@angular/animations';

const ANIMATION_PRELOADER =
    trigger('preloader', [
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
        transition('inactive => active', animate('2000ms')),
        transition('active => enfasis', animate('4000ms', keyframes([
            style({ opacity: 1, transform: 'rotateY(-90deg)', offset: 0.5 }),
            style({ opacity: 1, transform: 'rotateY(-180deg)', offset: 0.7 }),
            style({ opacity: 1, transform: 'rotateY(-270deg)', offset: 0.9 }),
            style({ opacity: 1, transform: 'rotateY(-360deg)', offset: 1 })
        ]))),
        transition('enfasis => inactive', animate('2000ms'))

    ]);

    export{
        ANIMATION_PRELOADER
    }