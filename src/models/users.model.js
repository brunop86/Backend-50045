import mongoose from "mongoose";

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
  age: {
    type: Number,
    required: true,
  },
  cart: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Cart",
  },
  password: {
    type: String,
    //required: true,
  },
  rol: {
    type: String,
    enum: ["admin", "user"],
    default: "user",
    //required: true,
  },
});

const UserModel = mongoose.model("user", userSchema);

export default UserModel;
