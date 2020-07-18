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
    // input.focus({preventScroll: true}); // << nice, but, we'll go without
    /* The "prevent" is good, for wide screen (keeps header at top, looks nice)
    But the "prevent" is not so good for narrow, mobile screen. (That header sticking to top means the first form field is "below the fold" / invisible. Hmm.

    https://developer.mozilla.org/en-US/docs/Web/API/HTMLOrForeignElement/focus
     */
    // input.select();
  }

}
