
describe("validating rest calls to subscription",function(){
  it("should get all subscription",function(){

    console.log("Hi");

    var restify = require('restify');
    // Creates a JSON client
    var client = restify.createJsonClient({
      url: 'http://localhost:3000'
    });

    //client.basicAuth('$login', '$password');
    runs(function(){
      client.get('/api', function(err, req, res, obj) {
        console.log("res"+JSON.stringify(req, null, 2));
        console.log(JSON.stringify(err, null, 2));
        assert.ifError(err);

      })
    });
  });
});
