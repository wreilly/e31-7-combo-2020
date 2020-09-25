import {Component, OnInit, AfterViewChecked, Input, Output, EventEmitter, ChangeDetectorRef} from '@angular/core';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import * as fromRoot from '../../store/app.reducer';

import { ArticleService } from '../../articles/article.service';
import { FilterSortService } from '../../core/services/filter-sort.service';
import { Article, Category } from '../../articles/article.model';

@Component({
  selector: 'app-categorizer-two',
  templateUrl: './categorizer-two.component.html',
  styleUrls: ['./categorizer-two.component.scss']
})
export class CategorizerTwoComponent implements OnInit, AfterViewChecked {

  @Input('topOrBottomInputName')
  topOrBottomInput: string;

  @Input('articlesCountInputName')
  articlesCountInput: number; // in (the selected, filtered) Category

  @Input('offsetNumberInputName')
  offsetNumberInput: number; // values like 20, 40, 60...
  /* Note:
  fwiw, By time it gets here, this has been INCREMENTED (40, 60, 80...)
  over in Parent: ArticlesCategorizedComponent.getArticlesLoadMore()
  - Pro: the figure is ready for next click on Load More button = good
   */

  @Input('articlesCountAllInCollectionInputName')
  articlesCountAllInCollectionInput: number; // in entire MongoDB Collection

  @Input('articlesInputName')
  articlesInput: Article[];

  @Input('noArticlesInCategoryInputName')
  noArticlesInCategoryInput: boolean;

  @Input('noArticlesInCategoryWhichCategoryInputName')
  noArticlesInCategoryWhichCategoryInput: boolean;

  @Input('articlesInCategoryWhichCategoryInputName')
  articlesInCategoryWhichCategoryInput: string;

  @Input('loadNoMoreInputName')
  loadNoMoreInput: boolean;


  @Output()
  categorizerGetArticlesLoadMoreEvent = new EventEmitter<{
    offsetNumberOutput: number,
  }>();

  @Output()
  categoryViewValueSelectedOutputEvent = new EventEmitter<{
    categoryViewValueOutput: string,
  }>();

  // LOAD MORE
  offsetPageSizeInCategorizer = 20; // HARD-CODED.
  /*
  Matches Parent ArticlesCategorizedComponent. HARD-CODED.
  Matches BE. HARD-CODED.

  Parent:
    src/app/articles/articles-categorized-two/articles-categorized-two.component.ts:37
    offsetPageSizeInParent = 20; // HARD-CODED.

  BE:
    routes/api/api-articles.js:145
    const pageSize = 20; // HARD-CODED. 20 articles per "Load More" page.
   */

  categories: Category[];

  myUIIsLoadingStore$: Observable<boolean>;

  constructor(
      private myArticleService: ArticleService,
      private myFilterSortService: FilterSortService,
      private myStore: Store,
      private myChangeDetectorRef: ChangeDetectorRef, // << Will I use? hmm. SEEMS NOPE. good. << YES! we DO use it. sheesh.
  ) { }

  ngOnInit(): void {

    this.myUIIsLoadingStore$ = this.myStore.select(fromRoot.getIsLoading);

    this.categories = this.myArticleService.getCategoriesInService();

  } // /ngOnInit()

  ngAfterViewChecked() {

    console.log('0006 ngAfterViewChecked() this.articlesInCategoryWhichCategoryInput ', this.articlesInCategoryWhichCategoryInput);
    /* Hard (for me) to judge, is this normal/okay, or problematic. Going with "okay/good-enough."
    1. On change Category, runs 4 or 6 times. Shows current Category 2 or 4 times, new Category 2 times.
    2. On Load More, runs 14 times. Shows the (unchanging) current Category all 14 times.
     */

    // $$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$
    this.updateDrawRedrawHereArticlesCategorizer(
        this.offsetNumberInput,
        this.articlesCountInput,
        this.articlesCountAllInCollectionInput,
        this.articlesInCategoryWhichCategoryInput,
        this.noArticlesInCategoryWhichCategoryInput,
        this.loadNoMoreInput,
    )
    // $$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$

    /*
https://stackoverflow.com/questions/34364880/expression-has-changed-after-it-was-checked
 */
    this.myChangeDetectorRef.detectChanges();

  } // /ngAfterViewChecked()


  emitCallGetArticlesLoadMore(offsetNumberToEmit) {
    // console.log('CTGZ-04 - emitCallGetArticlesLoadMore() offsetNumberToEmit ', offsetNumberToEmit); // Yes. 20, 40, 60...

    this.categorizerGetArticlesLoadMoreEvent.emit( {
          offsetNumberOutput: offsetNumberToEmit,
        }
    );

  } // /emitCallGetArticlesLoadMore()


  emitCategoryViewValueSelected(
      categoryViewValuePassedIn: string,
  ) {

    this.categoryViewValueSelectedOutputEvent.emit({
      categoryViewValueOutput: categoryViewValuePassedIn,
    });

  } // /emitCategoryViewValueSelected()


  updateDrawRedrawHereArticlesCategorizer( // << Called from ngAfterViewChecked()
      offsetNumberHere,
      articlesCountHere,
      articlesCountAllInCollectionHere,
      articlesInCategoryWhichCategoryHere,
      noArticlesInCategoryWhichCategoryHere,
      loadNoMoreHere,
  ) {
    // cf. Paginator's updateRedrawHereArticlesControlledPaginator()

    // console.log('0008 updateDrawRedrawHereArticlesCategorizer() articlesInCategoryWhichCategoryHere << Passed-In ', articlesInCategoryWhichCategoryHere);

    this.offsetNumberInput = offsetNumberHere;
    this.articlesCountInput = articlesCountHere;
    this.articlesCountAllInCollectionInput = articlesCountAllInCollectionHere;
    this.articlesInCategoryWhichCategoryInput = articlesInCategoryWhichCategoryHere;
    this.noArticlesInCategoryWhichCategoryInput = noArticlesInCategoryWhichCategoryHere;
    this.loadNoMoreInput = loadNoMoreHere; // << N.B. *NO* "...Input" naming convention. (y not) (working fine)

    // console.log('0008A updateDrawRedrawHereArticlesCategorizer() this.articlesInCategoryWhichCategoryInput ', this.articlesInCategoryWhichCategoryInput);
    // console.log('0009 update() articlesInCategoryWhichCategoryHere ', articlesInCategoryWhichCategoryHere);

  } // /updateDrawRedrawHereArticlesCategorizer()

} // /CategorizerTwoComponent {}
