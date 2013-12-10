var mongoose = require('mongoose');
var Article = mongoose.model('Article');
var Subscription = mongoose.model('Subscription');
var request = require('request');
var async = require('async');
var htmlparser = require("htmlparser2");

var parseForImage = function(description){
  var fullText = "";
  var imgAttrib = null
  var parser = new htmlparser.Parser({
    onopentag: function(name, attribs){
      if(name === "img" && (attribs.width > 10 || attribs.height > 10)){
        imgAttrib = attribs;
      }
    },
      ontext: function(text){
        fullText += text;
      }
  });
  parser.write(description);
  parser.parseComplete();
  return {
    "text":fullText,
    "imgAttrib":imgAttrib
  }
}

module.exports = function(config){
  var log = require(config.root+'./lib/log.js').appLogger;
  var getArticle = function(item){
    var article = new Article();
    article.title = item.title;
    //article.summary = item.summary;
    article.author = item.author;
    //article.comments = item.comments;
    article.date = item.date;
    //article.image = item.image;
    article.link = item.link;
    article.categories = item.categories;
    parsedInput = parseForImage(item.description);
    //console.log("parsedInput ", JSON.stringify(parsedInput));
    if(parsedInput.imgAttrib){
      article.image.url = parsedInput.imgAttrib.src;
      article.image.width = parsedInput.imgAttrib.width;
      article.image.height = parsedInput.imgAttrib.height;
    }
    //article.description = parsedInput.text;
    article.description = item.description;
    return article;
  }
  var getAllArticlesFromSub = function(id, callback){
    Subscription.find({_id:id}, 'articles', function(error, data){
      if(error) callback(error);
      if(data.length == 0) return callback(new Error("No matching subscriptions:"+JSON.stringify(query)));
      callback(data[0].articles);
    });
  }
  return {
    getArticle:getArticle,
    getAllArticlesFromSub:getAllArticlesFromSub
  }
}


