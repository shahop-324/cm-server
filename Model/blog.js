const mongoose = require("mongoose");
const { commentSchema } = require("./comment");

const blogSchema = new mongoose.Schema({
  cover: {
    type: String,
  },
  status: { type: String, enum: ["draft", "published"], default: "draft" },
  title: {
    type: String,
  },
  description: {
    type: String,
  },
  html: {
    type: String,
  },
  createdAt: {
    type: Date,
  },
  view: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
  },
  share: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
  },
  favorite: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
  },
  author: {
    type: mongoose.Schema.ObjectId,
    ref: "Admin",
  },
  tags: [
    {
      type: String,
    },
  ],
  comments: [commentSchema],
  enableComments: {
    type: Boolean,
    default: true,
  },
  metaTitle: { type: String },
  metaDescription: { type: String },
  metaKeywords: [{ type: String }],
  readingTime: { type: Number, default: 240 }, // reading time in seconds
});

blogSchema.index({
  title: "text",
  html: "text",
  description: "text",
});

const Blog = new mongoose.model("Blog", blogSchema);
module.exports = Blog;
