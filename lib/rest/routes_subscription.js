var restify = require('restify');
module.exports = function(app,auth,baseUrl, config){
  var subscription = require(config.root+'./lib/middleware/subscription.js');
  var resourceUrl = baseUrl+"/subscriptions";
  console.log(resourceUrl);
  // getting the list of all subscriptions
  app.get(resourceUrl, auth.requiresLogin, function(req,res,next){
    if(!req.accepts("application/json")){
      next(new restify.InvalidHeaderError('invalid accpet header'));
    }
    subscription.getSub({},'name',res);
  });
  // Adding a single subscription
  app.post({url: resourceUrl+"/xmlUrl", validation: {
          url:{isRequired:true, isUrl:true, scope:'params'}
        }
      },
      auth.requiresLogin, function(req,res,next){
    if(!req.accepts("application/json")){
      return next(new restify.InvalidHeaderError('invalid accpet header'));
    }
    if(!req.is("application/json")){
      return next(new restify.InvalidContentError('invalid content type'));
    }
    subscription.addSub(req.params.url, res);
    //res.send(req.params);
  });

  // getting a single subscription information
  app.get(resourceUrl+"/:id", auth.requiresLogin, function(req,res){
    res.send(req.params);
  });
  
  // Importing a list of urls from xml files 
  app.post(resourceUrl+"/xmlUrls", auth.requiresLogin, function(req,res){
    res.send(req.params);
  });
  
  
}
