/***************************************************************
* Following block of code is taken from 
* https://github.com/mkholodnyak/node-search-engine-parser/blob/master/strategies/google-images-strategy.js
* I tried to use the whole package but it didn't return what is expected. 
* I had to modify it because the regexes and selector were out of date 
* with the new html provided by Google Search results
* Even though the browser treats them as regular a and img tags, 
* what is provided is a json string inside a div tag.
***************************************************************/

var cheerio = require('cheerio');

var IMAGE_DIVS_SELECTOR = 'div.rg_meta.notranslate';
var GOOGLE_SEARCH_URL = 'http://images.google.com/search?tbm=isch&q=';

var GoogleImageSearch = {
  getSearchURL : function(query){
    return GOOGLE_SEARCH_URL + query;
  },

  getResults : function(html, callback){
    var $ = cheerio.load(html);
    var imageDivs = $(IMAGE_DIVS_SELECTOR);
    var imageObjects = [];

    imageDivs.each(function collectJSON(i, element){
      imageObjects.push(JSON.parse($(element).text()));
    });
        
    callback(null, imageObjects);
  },
    
  options: {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/46.0.2490.86 Safari/537.36'
    }
  }
};

module.exports = GoogleImageSearch;