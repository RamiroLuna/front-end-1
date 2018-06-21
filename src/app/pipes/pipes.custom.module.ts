import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormatNumberPipeClass } from './format.number.pipe';
import { ToneladasPipeClass } from './toneladas.pipe';
import { SeparatorPipeClass } from './separator.pipe';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    FormatNumberPipeClass,
    ToneladasPipeClass,
    SeparatorPipeClass
  ],
  exports: [ 
      FormatNumberPipeClass,
      ToneladasPipeClass,
      SeparatorPipeClass

    ]
})
export class PipesCustomModule { }