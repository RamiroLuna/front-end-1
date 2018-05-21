import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'formatDecimal' })
export class FormatNumberPipeClass implements PipeTransform {
  transform(numero: any , precision:number):string {
   if(numero === ""){
      return  "";
    }else{
      return parseFloat(numero).toFixed(precision);
    }
    
  }
}