export interface Article {
    articleId_name: string;
    articleTitle_name: string;
    articleUrl_name: string;
}
/* Note re: CATEGORY
w-i-p
Not yet in use.
We are still mostly using 2018 server, doesn't have Category. sigh.
 */
/* Note re: Photos
Ain't there, yet. cheers. looking forward to it.
 */
/*
Note re: above.

This model in the Angular client describes the fields
used here in the Form to create an Article. Okay.

Meantime, down in the Node server and MongoDB we actually
store an "Article" with slightly different property names:
- _id
- articleTitle
- articleUrl

We "map" from the client mode to the server mode,
in simple hard-coded kind of way,
way down in the server's Controller
'apiCreateArticle()' method.

Question has arisen, when the client retrieves articles
from the back-end server & database, they (of course)
come with the back-end property names.
Q. Should the client *re-convert* those to the front-end
property names, for display & Etc. ?
- Doing so would permit continued use of the Typescript
interface 'Article' seen here.
- But on the other hand, it seems kinda crazy.
- N.B. I did *not* do these machinations in the 2018 iteration
of this client-server-combo biz.

A. Well, bit tricky, but I did it. So, we'll give it a whirl, see if we keep it or not. T.B.D.
 */

export interface Category {
    value: string;
    viewValue: string;
}
