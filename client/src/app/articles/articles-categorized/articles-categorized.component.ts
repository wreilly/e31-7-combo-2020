import { Component, OnInit } from '@angular/core';
import { map } from 'rxjs/operators';
import { Article, Category } from '../article.model';
import { ArticleService } from '../article.service';
import { FilterSortService } from '../../core/services/filter-sort.service';

@Component({
  selector: 'app-articles-categorized',
  templateUrl: './articles-categorized.component.html',
  styleUrls: ['./articles-categorized.component.scss']
})
export class ArticlesCategorizedComponent implements OnInit {

  articles: Article[]; // empty to begin
  articlesToDisplay: Article[];
  // Be that ALL, or Filtered

  articlesCount: number;
  articlesInCategoryWhichCategory = 'All Articles'; // init  // string; // e.g. 'Politics' when there ARE articles

  categories: Category[];
  noArticlesInCategory = false; // init
  noArticlesInCategoryWhichCategory: string;
  // e.g. 'Arts' when there are 0 articles in Arts

  constructor(
      private myArticleService: ArticleService,
      private myFilterSortService: FilterSortService,
  ) { }

  ngOnInit(): void {

    this.categories = this.myArticleService.getCategoriesInService(); // whamma-jamma

    this.getArticles();

  }

  getArticles() {
    this.myArticleService.listArticles()
        .subscribe(
            (allArticlesWeGot: []) => {
              console.log('allArticlesWeGot ', allArticlesWeGot);
              /* [] of {} = OK
articleCategory: "u.s."
articleTitle: "Covid-19EDIT jjj kkk NAV ARTICLES Live Updates: a One More Vaccine Trial Is Halted After Patient Becomes Ill"
articleUrl: "https://www.nytimes.com/2020/09/09/world/covid-19-coronavirus.html"
__v: 0
_id: "5f58ae8d4d2835ae66510f4a"
               */

              /* Hmm. Error:
"core.js:6228 ERROR TypeError: allArticlesWeGot.map is not a function"

              (allArticlesWeGot: [
                { // "BE Article"
                  _id: string,
                  articleTitle: string,
                  articleUrl: string,
                  articleCategory: string, // << BE 'value' e.g. 'u.s.'
                }
              ]) => {
*/

              // HMM. this.articlesCount = allArticlesWeGot.length;

/* HMM. */
              this.articles = allArticlesWeGot.map(
                  this.myArticleService.myMapBEArticlesToFEArticles
              );


              this.articlesToDisplay = this.articles; // whamma-jamma

              this.articlesCount = this.articlesToDisplay.length;

            }
        ) // /.subscribe()
  } // /getArticles()

  letUsFilterByCategory (categoryStoredValuePassedIn: string): void {
    /*
    Doesn't return anything. Just sets variables for use in display.
     */
    // Hmm. Is it "StoredValue" ? ('arts')
    // I think it's viewValue ('Arts') << YEAH!
    this.noArticlesInCategory = false; // reset
    this.noArticlesInCategoryWhichCategory = ''; // reset

    if (categoryStoredValuePassedIn === 'ALL') {
      /*  *************
      01 - USER CLICK ON THE 'ALL' BUTTON
          *************
       */
      this.articlesToDisplay = this.articles;
      this.articlesInCategoryWhichCategory = 'ALL Articles';
    } else if (categoryStoredValuePassedIn === 'No Category (thx Service!)') {
      /*  *************
      02 - USER CLICK ON THE 'NO CATEGORY' BUTTON
          *************
      */

      // << YES, actually passed in (from that user button click

      /* COMBO HERE
Looking to account for both:
&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&
const NO_CATEGORY         = 'No Category (thx Service!)'; // << Count 62 (right now)
const NO_CORRECT_CATEGORY = 'No Correct Category (thx Service!)'; // << Count 3 (right now)
&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&
Goal is to display both sets together: 65 count
That is, user click on "No Category Assigned" button
yields both No Category, and No Correct Category.
cheers.
 */
      let articlesNoCategorySpecialFilteredFromService: any[];
      articlesNoCategorySpecialFilteredFromService = this.myFilterSortService.mySpecialFilter(this.articles, 'articleCategory_name', categoryStoredValuePassedIn);
      /* e.g.
        No Category (thx Service!) // << YES, actually passed in (from that user button click)
        "5f3515d7dec9620d8d5fe63a"

        No Correct Category (thx Service!)
        // NO! Perhaps surprisingly, the U/I
        button click is NOT passing this string.
        No. But, triggered by the above string
        of "No C.", we, over in the FilterService
        HARD-CODE in to test ALSO for this
        string of "No Correct C."
        cheers.
        "5af83649f2fffa14c4a22cd7"
       */

      this.articlesToDisplay = articlesNoCategorySpecialFilteredFromService;

      this.articlesInCategoryWhichCategory = 'No Category Assigned'; // << To show on U/I
      // Accounts for both: No C., No Correct C.


    } else {
      /*  *************
      03 - USER CLICK ON ANY REGULAR CATEGORY BUTTON (e.g. Politics)
          *************
      */
      // A proper Category, from our approved list :)

      let articlesFilteredFromService: any[];
      articlesFilteredFromService = this.myFilterSortService.myFilter(this.articles, 'articleCategory_name', categoryStoredValuePassedIn);

      this.articlesToDisplay = articlesFilteredFromService;

      this.articlesInCategoryWhichCategory = categoryStoredValuePassedIn;

    }

    this.articlesCount = this.articlesToDisplay.length;

    if (this.articlesCount === 0) {
      // No articles under, e.g., 'Arts' (sigh)
      this.noArticlesInCategory = true;
      this.noArticlesInCategoryWhichCategory = categoryStoredValuePassedIn;
    }

  } // /letUsFilterByCategory()

} // /ArticlesCategorizedComponent {}
