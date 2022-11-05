const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
  blog: { type: mongoose.Schema.ObjectId, ref: "Blog" },
  author: { type: mongoose.Schema.ObjectId, ref: "User" },
  status: { type: String, enum: ["visible", "hidden"], default: "visible" },
  highlighted: { type: Boolean, default: false },
  pinned: { type: Boolean, default: false },
  message: { type: String },
  upvote: [],
  downvote: [],
  heart: { type: Boolean, default: false },
  createdAt: { type: Date },
  updatedAt: { type: Date },
  replies: [this],
});

const Comment = new mongoose.model("Comment", commentSchema);
module.exports = { Comment, commentSchema };
