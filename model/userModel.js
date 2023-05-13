const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  username: String,
  avatar: String,
  email: String,
  password: String,
});

const userModel = mongoose.model("user", userSchema);

module.exports = {
  userModel,
};
