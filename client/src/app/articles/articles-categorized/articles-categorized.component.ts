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

            }
        ) // /.subscribe()
  } // /getArticles()

  letUsFilterByCategory (categoryStoredValuePassedIn: string) {
    // Hmm. Is it "StoredValue" ? ('arts')
    // I think it's viewValue ('Arts')
    this.noArticlesInCategory = false; // reset
    this.noArticlesInCategoryWhichCategory = ''; // reset

    if (categoryStoredValuePassedIn === 'ALL') {
      this.articlesToDisplay = this.articles;
      this.articlesInCategoryWhichCategory = 'ALL Articles';
    } else {
      let articlesFilteredFromService: any[];
      articlesFilteredFromService = this.myFilterSortService.myFilter(this.articles,'articleCategory_name', categoryStoredValuePassedIn);

      // TODO 2020-09-12_11:15AM
      if (categoryStoredValuePassedIn === 'No Category (thx Service!)') {
        this.articlesInCategoryWhichCategory = 'No Category Assigned';
      } else {
        this.articlesInCategoryWhichCategory = categoryStoredValuePassedIn;
      }

      this.articlesToDisplay = articlesFilteredFromService;

    }

    this.articlesCount = this.articlesToDisplay.length;

    if (this.articlesCount === 0) {
      // No articles under, e.g., 'Arts' (sigh)
      this.noArticlesInCategory = true;
      this.noArticlesInCategoryWhichCategory = categoryStoredValuePassedIn;
    }

  } // /letUsFilter()

}
