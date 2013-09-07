var mongoose = require('mongoose');
var Subscription = mongoose.model('Subscription');
var parser = require('xml2js');
var fs = require('fs');
var request = require('request');
var async = require('async');

module.exports = function(config){
  var Article = require(config.root+'./lib/middleware/article.js')(config);
  var Log = require(config.root+'./lib/log.js').appLogger;

  var storeMeta = function(meta, url){
    var sub = new Subscription();
    sub.name = meta.title;
    sub.subscriptionUrl = url;
    sub.siteUrl = meta.link;
    sub.categories = meta.categories;
    sub.image = meta.image;
    sub.date = meta.date;
    return sub;
  }

  var isSubDuplicate = function(url, callback, next){
    Subscription.find({subscriptionUrl:url}, 'name', function(err, docs){
      if(docs.length) return callback(new Error("Subscription with same url already exists: "+ docs.length));
      else next();
    });
  }
  var isLinkDuplicate = function(link, callback, next){
    if(link){
      Subscription.find({siteUrl:link},'name', function(err, docs){
        if(docs.length) return callback(new Error("Subscription with same link already exists: "+ docs.length));
        else next();
      });
    }
  }
  var isTitleDuplicate = function(title, callback, next){
    if(title){
      Subscription.find({name:title},'name', function(err, docs){
        if(docs.length) callback(new Error("Subscription with same title already exists: "+ docs.length));
        else next();
      });
    }
  }


  var addSub = function(url, callback){
    var feedparser = new require('feedparser')();
    var articles = [];
    var subscription = null;
    Log.debug("url "+url);
    request(url)
      .on('error', function(error){
        return callback(error);
      })
    .pipe(feedparser)
      .on('error', function(error){
        return callback(error);
      })
    .on('meta',function(meta){
      async.series([
        function(next){ isSubDuplicate(url, callback, next); },
        function(next){ isLinkDuplicate(meta.link, callback, next); },
        function(next){ isTitleDuplicate(meta.title, callback, next); },
        function(next){ subscription = storeMeta(meta, url); }],
        function(err, results){
        });
    })
    .on('readable',function(){
      var stream = this, item;
      while (item = stream.read()) {
        var newArticle = Article.getArticle(item);
        articles.push(newArticle);
      }
    })
    .on('end', function(){
      Log.info("Num articles "+articles.length);
      Log.info("Subscription "+subscription);
      if(articles.length == 0 || !subscription){
        return callback(new Error("Problem in parsing the subscription meta "+subscription+" articles size "+articles.length));
      }
      subscription.articles = articles;
      subscription.save(function(err){
        if(err) return callback(err);
        return callback(subscription);
      });
    });
  }
  var getSub = function(query, projection, callback){
    Subscription.find(query, projection, function(error, data){
      Log.info("Query "+query);
      if(error) return callback(error);
      if(data.length == 0) return callback(new Error("No matching subscriptions:"+JSON.stringify(query)));
      return callback(data);
    });
  }
  var delSub = function(id, callback){
    Subscription.remove({_id:id}, function(error){
      if(error) return callback(error);
      return callback({message:"Subscription of id "+id+" deleted."});
    });
  }

  var read = function(error, xml){
    parser.parseString(xml,function(error, json){
      //console.log("Error "+error);
      //console.log("Length of body "+json.opml.body[0].outline.length);
      var xmlUrls = [];
      var outline = json.opml.body[0].outline;
      for(var i=0;i<outline.length;i++){
        if(outline[i].hasOwnProperty('outline')){
          var inOutline = outline[i].outline;
          console.log(outline[i].$.title+" "+inOutline.length);
          for(var j=0;j<inOutline.length;j++){
            //console.log("links "+JSON.stringify(inOutline[j]));
            //console.log("links "+inOutline[j].$.xmlUrl);
            xmlUrls.push(inOutline[j].$.xmlUrl);
            if(inOutline[j].hasOwnProperty('outline')){
              console.log("Is this possible?");
            }
          }
        }
        else{
          //console.log("links "+JSON.stringify(outline[i]));
          //console.log("links "+outline[i].$.xmlUrl);
          xmlUrls.push(outline[i].$.xmlUrl);
        }
      }
      //console.log(xmlUrls);
      async.each(xmlUrls, addSub, function(error){
        console.log("async error "+error);
      });
    });
  }
  return {
    getSub:getSub,
    addSub:addSub,
    delSub:delSub
  }
}
