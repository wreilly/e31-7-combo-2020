import { Injectable } from '@angular/core';
import { CdkScrollable } from '@angular/cdk/scrolling';
// Hmm. I got CdkScrollable from '@angular/cdk/overlay' over in ScrollTopComponent. Hmm.
import { Observable, Subject } from 'rxjs';

@Injectable()
export class ScrollService {

    lastOffset: number;

    private _scrollOffsetInServiceSubject$: Subject<number> = new Subject<number>();

    public scrollOffsetInServiceObservable: Observable<number> = this._scrollOffsetInServiceSubject$.asObservable();

    myOnWindowScroll(scrollData: CdkScrollable) {

        // noinspection DuplicatedCode
        const myScrollTop = scrollData.getElementRef().nativeElement.scrollTop || 0;

        console.log('Scroll biz myScrollTop ', myScrollTop);
        /* E.g.,
            0, 278.66666453647, 280, 10994  etc.
             */

        console.log('Scroll biz scrollData ', scrollData);
        /*
            CdkScrollable {elementRef: ElementRef, scrollDispatcher: ScrollDispatcher, ngZone: NgZone, dir: Directionality, _destroyed: Subject, …}
             */

        console.log('Scroll biz scrollData.getElementRef() ', scrollData.getElementRef());
        /*
    ElementRef {nativeElement: mat-sidenav-content.mat-drawer-content.mat-sidenav-content}
             */

        console.log('Scroll biz scrollData.getElementRef() ', scrollData.getElementRef().nativeElement.nodeName);
        /*
            MAT-SIDENAV-CONTENT
             */

        if (this.lastOffset > myScrollTop) {
            console.log('Show toolbar');
        } else if (myScrollTop < 10) {
            console.log('Show toolbar');
        } else if (myScrollTop > 100) {
            console.log('Hide toolbar');
        }

        this.lastOffset = myScrollTop;

        this._scrollOffsetInServiceSubject$.next(myScrollTop);

    }

}
