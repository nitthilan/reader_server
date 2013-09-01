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
    subscription.getSub({},'name subscriptionUrl',res);
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
  app.get({url : resourceUrl+"/:id", validation:{
      id:{isRequired:true, isHexadecimal:true, scope:'params'}
    }
  }, 
  auth.requiresLogin, function(req,res){
    if(!req.accepts("application/json")){
      next(new restify.InvalidHeaderError('invalid accpet header'));
    }
    console.log("ID ", req.params.id);
    subscription.getSub({_id:req.params.id},'',res);
  });
   // getting a single subscription information
  app.del({url : resourceUrl+"/:id", validation:{
      id:{isRequired:true, isHexadecimal:true, scope:'params'}
    }
  }, 
  auth.requiresLogin, function(req,res){
    console.log("ID ", req.params.id);
    subscription.delSub(req.params.id,res);
  });
  
  // Importing a list of urls from xml files 
  app.post(resourceUrl+"/xmlUrls", auth.requiresLogin, function(req,res){
    res.send(req.params);
  });
  
  
}
