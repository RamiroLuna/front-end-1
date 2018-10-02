import { animate, state, style, transition, trigger, keyframes, query, stagger, AnimationBuilder, AnimationPlayer } from '@angular/animations';
const EFECTS_ENFASIS = ['rotarY', 'rotarX'];
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
        state('void', style({
            opacity: 0,
            display: 'none'
        })),
        transition('inactive => active', animate('2000ms')),
        transition('active => rotarY', animate('4000ms', keyframes([
            style({ opacity: 1, transform: 'rotateY(-90deg)', offset: 0.1 }),
            style({ opacity: 1, transform: 'rotateY(-180deg)', offset: 0.3 }),
            style({ opacity: 1, transform: 'rotateY(-270deg)', offset: 0.6 }),
            style({ opacity: 1, transform: 'rotateY(-360deg)', offset: 1 })
        ]))),
        transition('active => rotarX', animate('4000ms', keyframes([
            style({ opacity: 1, transform: 'rotateX(-90deg)', offset: 0.1 }),
            style({ opacity: 1, transform: 'rotateX(-180deg)', offset: 0.3 }),
            style({ opacity: 1, transform: 'rotateX(-270deg)', offset: 0.6 }),
            style({ opacity: 1, transform: 'rotateX(-360deg)', offset: 1 })
        ]))),
        transition('active => rotarZ', animate('4000ms', keyframes([
            style({ opacity: 1, transform: 'rotateZ(-90deg)', offset: 0.1 }),
            style({ opacity: 1, transform: 'rotateZ(-180deg)', offset: 0.3 }),
            style({ opacity: 1, transform: 'rotateZ(-270deg)', offset: 0.6 }),
            style({ opacity: 1, transform: 'rotateZ(-360deg)', offset: 1 })
        ]))),
        transition('rotarX => inactive', animate('2000ms')),
        transition('rotarY => inactive', animate('2000ms')),
        transition('rotarZ => inactive', animate('2000ms')),
    ]);

const ANIMATION_REPORTE =
    trigger('showingRpt', [
        state('inactive', style({
            opacity: 0,
            display: 'none'
        })),
        state('active', style({
            opacity: 1,
            display: 'block',
        })),
      
        transition('inactive => active', animate('2000ms')),
        transition('active => desplazarY', animate('120000ms', keyframes([
            style({ opacity: 1, transform: 'translateY(-400px)', offset: 0.1 }),
            style({ opacity: 1, transform: 'translateY(-800px)', offset: 0.2 }),
            style({ opacity: 1, transform: 'translateY(-1200px)', offset: 0.3 }),
            style({ opacity: 1, transform: 'translateY(-1600px)', offset: 0.4 }),
            style({ opacity: 1, transform: 'translateY(-2000px)', offset: 0.5 }),
            style({ opacity: 1, transform: 'translateY(-2400px)', offset: 0.6 }),
            style({ opacity: 1, transform: 'translateY(-2800px)', offset: 0.7 }),
            style({ opacity: 1, transform: 'translateY(-3325px)', offset: 0.8 }),
            style({ opacity: 1, transform: 'translateY(-3850px)', offset: 0.9 }),
            style({ opacity: 1, transform: 'translateY(-4380px)', offset: 1 })
        ])))

    ]);

export {
    ANIMATION_PRELOADER,
    ANIMATION_REPORTE,
    EFECTS_ENFASIS,
    AnimationPlayer,
    AnimationBuilder
}