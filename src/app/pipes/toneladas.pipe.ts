import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'toneladas' })
export class ToneladasPipeClass implements PipeTransform {
  transform(texto:string):string {    
    return texto + ' T ';
  }
}