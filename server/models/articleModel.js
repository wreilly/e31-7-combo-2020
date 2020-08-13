const mongoose = require('mongoose');

const articleSchema = new mongoose.Schema({
   articleUrl: {
       type: String,
       required: true
   },
    articleTitle: {
       type: String,
        required: true
    },
    articleCategory: {
       type: String,
        required: true
    }
});
// LATER: articlePhotos: [String]

// TEMPORARY MODEL to Get Us Going
const articleModelConstHere = mongoose.model(
  'Newarticle',
  articleSchema
);
/* WILL BE REAL MODEL FOR 2020
const articleModelConstHere = mongoose.model(
    'New2020article',
    articleSchema
);
*/

/*
Above 'New2020article' << capital letter, singular
should create a new collection in MongoDB 'new2020articles' << lowercase, pluralized

> db
cscie31
> show collections
articles         // << 2018 ca. April.May initial
newarticles      // << 2018 ca. May/June second
new2020articles  // << 2020 June/July?... re-visit
 */

module.exports = articleModelConstHere;
