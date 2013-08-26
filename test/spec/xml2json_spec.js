describe("Validating xml2json functionalities",function(){
  xit("should parse a string xml",function(){
    var xmlparser = require('xml2js').parseString;
    var xml = "<root> Hello </root>";
    xmlparser(xml,function(err,result){
      console.log("error "+err);
      console.log("JSON "+result.root);
    });
  });
  it("should parse a file", function(){
    var parser = require('xml2js');
    var FeedParser = require('feedparser');
    var request = require('request');
    var fs = require('fs');
    console.log(__dirname);
    fs.readFile(__dirname+'/../../subscription/subscriptions.xml',function(error, xml){
      console.log("Error "+error);
      parser.parseString(xml,function(error, json){
        console.log("Error "+error);
        console.log("Length of body "+json.opml.body[0].outline.length);
        var outline = json.opml.body[0].outline;
        for(var i=0;i<outline.length;i++){
          if(outline[i].hasOwnProperty('outline')){
            var inOutline = outline[i].outline;
            //console.log(outline[i].$.title+" "+inOutline.length);
            for(var j=0;j<inOutline.length;j++){
              //console.log(inOutline[i].$.title+" "+inOutline.length);
              console.log("links "+JSON.stringify(inOutline[j]));
              if(inOutline[j].hasOwnProperty('outline')){
                console.log("Is this possible?");
              }
            }
          }
          else{
            //console.log("links "+JSON.stringify(outline[i]));
          }
        }
        //console.log("parsed JSON "+JSON.stringify(json));
        /*fs.writeFile(__dirname+'/../../subscription/subscriptions.json', JSON.stringify(json, null, 2), function (err) {
          if (err) throw err;
          console.log('It\'s saved!');
        });*/
      });
    });
  });
});
