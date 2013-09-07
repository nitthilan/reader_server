
var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;

var articleSchema = new Schema({
  title: String,
    description: String,
    summary: String,
    date: String,
    link: String,
    author: String,
    comments : String,
    categories : [String],
    image : {
      url : String,
      title : String
    }
});


var subscriptionSchema = new Schema({
  name: String,
    subscriptionUrl: String,
    type: {type: String, enum: ['rss'], default: 'rss'},
    siteUrl: String,
    categories: [String],
    image: {
      url: String,
      title: String
    },
    date: String,
    articles:[articleSchema] // https://github.com/LearnBoost/mongoose/issues/762
});

module.exports = mongoose.model('Article',articleSchema);
module.exports = mongoose.model('Subscription',subscriptionSchema);
