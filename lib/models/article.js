var mongoose = require('mongoose')
, Schema = mongoose.Schema
, ObjectId = Schema.ObjectId;

var articleSchema = new Schema({
  title: String,
    description: String,
    summary: String,
    date: String,
    link: String,
    author: String,
    comments : String,
    categories : [String]
});

module.exports = mongoose.model('article',articleSchema);
