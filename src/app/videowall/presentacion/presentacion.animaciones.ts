import { animate, state, style, transition, trigger, keyframes, query, stagger , AnimationBuilder} from '@angular/animations';
const EFECTS_ENFASIS = ['rotarY', 'rotarX', 'rotarZ'];
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
        // transition('void => inactive', animate('2ms')),
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

export {
    ANIMATION_PRELOADER,
    EFECTS_ENFASIS
}