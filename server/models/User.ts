const mongoose = require("mongoose");

const { Schema } = mongoose;
const UserSchema = new Schema({
  name: {
    type: String,
    required: false,
  },
  email: {
    type: "string",
    required: true,
    unique: true,
  },
  password: {
    type: "string",
    required: true,
  },
  gender: {
    type: "string",
    required: true,
  },
  avatar: {
    type: "string",
    required: true,
  },
  description: {
    type: "string",
    required: false,
  },
  walletAddress: {
    type: "string",
    required: false,
  },
});
export const User = mongoose.model("user", UserSchema);
