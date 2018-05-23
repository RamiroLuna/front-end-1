import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'milles' })
export class SeparatorPipeClass implements PipeTransform {
  transform(numero: any): string {
    numero += '';
    let splitStr = numero.split('.');
    let splitLeft = splitStr[0];
    let splitRight = splitStr.length > 1 ? '.' + splitStr[1] : '';
    let regx = /(\d+)(\d{3})/;
    while (regx.test(splitLeft)) {
      splitLeft = splitLeft.replace(regx, '$1' + ',' + '$2');
    }
    return splitLeft + splitRight;

  }
}