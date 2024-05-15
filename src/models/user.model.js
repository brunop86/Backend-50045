const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  first_name: {
    type: String,
    required: true,
  },
  last_name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    index: true,
    unique: true,
  },
  cart: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Cart",
  },
  password: {
    type: String,
    //required: true,
  },
  role: {
    type: String,
    enum: ["admin", "user", "premium"],
    default: "user",
    //required: true,
  },
});

const UserModel = mongoose.model("user", userSchema);

module.exports = UserModel;
