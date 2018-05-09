import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'toneladas' })
export class PipeClass implements PipeTransform {
  transform(meta_alcanzada: string):string {
    return meta_alcanzada + " T ";
  }
}