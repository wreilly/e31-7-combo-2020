import { Directive, ElementRef, OnInit } from '@angular/core';

/*
https://stackoverflow.com/questions/50006888/set-focus-on-input-element
 */

@Directive({
  selector: '[appInputFocus]'
})
export class InputFocusDirective implements OnInit { // "FocusOnShowDirective" from S.O.

  constructor(
      private elementWithDirective: ElementRef
  ) {
    if (!elementWithDirective.nativeElement['focus']) {
      throw new Error('Element does not accept focus.');
    }
  }

  ngOnInit(): void {
    const input: HTMLInputElement = this.elementWithDirective.nativeElement as HTMLInputElement;
    input.focus();
    // input.select();
  }

}
