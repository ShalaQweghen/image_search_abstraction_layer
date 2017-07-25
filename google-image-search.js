/***************************************************************
* Following block of code is taken from 
* https://github.com/mkholodnyak/node-search-engine-parser/blob/master/strategies/google-images-strategy.js
* I tried to use the whole package but it didn't return what is expected. 
* I had to modify it because the regexes and selector were out of date 
* with the new html provided by Google Search results
* Even though the browser treats them as regular a and img tags, 
* what is provided is a json string inside a div tag.
* populateObj, searchedToday and searchAndServeImages are my additions.
***************************************************************/

var cheerio = require('cheerio');
var request = require('request');

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
  
  populateObj: function(result) {
    return {
      url: result.ou,
      snippet: result.pt,
      thumbnail: result.tu,
      context: result.ru
    }
  },
  
  searchAndServeImages: function(keyword, offset, res) {
    var that = this;
    var images = [];
    that.options.url = that.getSearchURL(keyword);

    request(that.options, function(err, response, body) {
      if (err) throw new Error("Connection Error!");

      that.getResults(body, function(err, results) {
        if (err) throw err;
        
        for (var i = 0; i < results.length; i++) {
          images.push(that.populateObj(results[i]));
          
          if (offset && images.length === offset-1) {
            break;
          }
        }
      });
      
      res.json(images);
    });
  },
  
  searchedToday: function(search) {
    return new Date(search.when).toDateString() === new Date(Date.now()).toDateString();
  },
    
  options: {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/46.0.2490.86 Safari/537.36'
    }
  }
};

module.exports = GoogleImageSearch;