const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  password: { type: String, required: true },
  score: { type: String, default : 0},
});

module.exports = mongoose.model("User", UserSchema);