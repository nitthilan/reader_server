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
    categories : [String],
    image : {
      url : String,
      title : String
    }
});

console.log("Registering article");
module.exports = mongoose.model('Article',articleSchema);
