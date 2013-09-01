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

exports.addSub = function(url, res){
  var feedparser = new require('feedparser')();
  console.log("url "+url);
  request(url)
    .on('error', function(error){
      //console.log("request Error "+url);
      //console.log("Error while parsing "+error.message);
      //console.log(error.stack);
      res.send(error);
    })
    .pipe(feedparser)
    .on('meta',function(meta){
      async.series([
        function(next){
          Subscription.find({subscriptionUrl:url}, 'name', function(err, docs){
            if(docs.length) res.send(400, new Error("Subscription with same url already exists: "+ docs.length));
            else next();
          });
        },
        function(next){
          if(meta.link){
            Subscription.find({siteUrl:meta.link},'name', function(err, docs){
              if(docs.length) res.send(400, new Error("Subscription with same link already exists: "+ docs.length));
              else next();
            });
          }
        },
        function(next){
          if(meta.title){
            Subscription.find({name:meta.title},'name', function(err, docs){
              if(docs.length) res.send(400, new Error("Subscription with same title already exists: "+ docs.length));
              else next();
            });
          }
        },
        function(next){
          sub = storeMeta(meta, url);
          console.log(sub);
          res.send(sub);
        }],
        function(err, results){
        });
    })
    .on('error', function(error){
      //console.log("addSub Error "+url);
      //console.log("Error while parsing "+error.message);
      //console.log(error.stack);
      res.send(error);
    });
    /* .on('end', function(){
    //console.log("completed parsing");
    //callback(null, url);
    }); */
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
exports.getSub = function(query, projection, res){
  Subscription.find(query, projection, function(error, data){
    if(error) res.send(error);
    if(data.length == 0) return res.send(new Error("No matching subscriptions:"+JSON.stringify(query)));
    res.send(data);
  });
}
exports.delSub = function(id, res){
  Subscription.remove({_id:id}, function(error){
    if(error) res.send(error);
    res.send({message:"Subscription of id "+id+" deleted."});
  });
}
