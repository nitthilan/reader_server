var mongoose = require('mongoose');
var Subscription = mongoose.model('Subscription');
var parser = require('xml2js');
var fs = require('fs');
var request = require('request');
var async = require('async');

var storeMeta = function(meta, url){
  var sub = new Subscription();
  sub.name = meta.title;
  sub.subscriptionUrl = url;
  sub.siteUrl = meta.link;
  sub.categories = meta.categories;
  sub.image = meta.image;
  sub.date = meta.date;
  sub.save();
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


exports.addSub = function(url, callback){
  var feedparser = new require('feedparser')();
  console.log("url "+url);
  request(url)
    .on('error', function(error){
      callback(error);
    })
    .pipe(feedparser)
    .on('meta',function(meta){
       async.series([
        function(next){ isSubDuplicate(url, callback, next); },
        function(next){ isLinkDuplicate(meta.link, callback, next); },
        function(next){ isTitleDuplicate(meta.title, callback, next); },
        function(next){
          sub = storeMeta(meta, url);
          console.log(sub);
          callback(sub);
        }],
        function(err, results){
        });
    })
    .on('error', function(error){
      callback(error);
    });
}
exports.getSub = function(query, projection, callback){
  Subscription.find(query, projection, function(error, data){
    if(error) return callback(error);
    if(data.length == 0) return callback(new Error("No matching subscriptions:"+JSON.stringify(query)));
    return callback(data);
  });
}
exports.delSub = function(id, callback){
  Subscription.remove({_id:id}, function(error){
    if(error) return callback(error);
    return callback({message:"Subscription of id "+id+" deleted."});
  });
}
exports.read = function(error, xml){
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

