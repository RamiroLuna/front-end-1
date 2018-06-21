import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormatNumberPipeClass } from './format.number.pipe';
import { ToneladasPipeClass } from './toneladas.pipe';
import { SeparatorPipeClass } from './separator.pipe';
import { LowerCasePipeClass } from './lower.case.pipe';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    FormatNumberPipeClass,
    ToneladasPipeClass,
    SeparatorPipeClass,
    LowerCasePipeClass
  ],
  exports: [ 
      FormatNumberPipeClass,
      ToneladasPipeClass,
      SeparatorPipeClass,
      LowerCasePipeClass

    ]
})
export class PipesCustomModule { }