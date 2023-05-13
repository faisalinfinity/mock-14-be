const mongoose = require("mongoose");

const blogSchema = mongoose.Schema({
  username: String,
  avatar:String,
  title: String,
  content: String,
  category: String,
  date: String,
  likes: Number,
  comments: [Object],
});

const blogModel = mongoose.model("blog", blogSchema);

module.exports = {
  blogModel,
};
