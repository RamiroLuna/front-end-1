import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'formatDecimal' })
export class FormatNumberPipeClass implements PipeTransform {
  transform(numero: any , precision:number):string {
    let result = parseFloat(numero).toFixed(precision);
    return result;
  }
}