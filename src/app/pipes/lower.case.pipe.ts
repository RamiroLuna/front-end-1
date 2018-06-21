import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'minuscula' })
export class LowerCasePipeClass implements PipeTransform {
  transform(texto:string):string {
    let resp = '';
    if(texto.includes('KPI')){    
      resp = texto.split(' ')[0] + ' ' + texto.split(' ')[1].toLowerCase(); 
    }else{
      resp = texto.toLowerCase();
    }
    return resp;
  }
}