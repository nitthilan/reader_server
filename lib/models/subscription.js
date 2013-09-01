
var mongoose = require('mongoose')
, Schema = mongoose.Schema
, ObjectId = Schema.ObjectId;

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
    date: String
});

module.exports = mongoose.model('Subscription',subscriptionSchema);
