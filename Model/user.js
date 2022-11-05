const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
  },
  lastName: {
    type: String,
  },
  email: {
    type: String,
  },
  avatar: {
    type: String,
  },
  otp: {
    type: Number,
  },
  emailVerified: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
  },
  updatedAt: {
    type: Date,
  },
  blogs: [
    {
      type: mongoose.Schema.ObjectId,
      ref: "Blog",
    },
  ],
  subscribed_newsletter: {
    type: Boolean,
    default: false,
  },
});

userSchema.index({
  email: "text",
});

const User = new mongoose.model("User", userSchema);
module.exports = User;
