// ! All of these are protected and can be executed by admin only

const catchAsync = require("../utils/catchAsync");

// create blog

exports.createBlogs = catchAsync(async (req, res, next) => {});

// update blog

exports.updateBlogs = catchAsync(async (req, res, next) => {});

// read one blog

exports.getBlog = catchAsync(async (req, res, next) => {});

// read all blogs (paginated)
// search blogs => based on term, tag

exports.getBlogs = catchAsync(async (req, res, next) => {
  res.status(200).json({
    status: "success",
    data: [{ key: 0 }, { key: 1 }, { key: 2 }, { key: 3 }, { key: 4 }],
  });
});

// delete blog

exports.deleteBlog = catchAsync(async (req, res, next) => {});

// like blog

exports.likeBlog = catchAsync(async (req, res, next) => {});

// unlike blog

exports.unlikeBlog = catchAsync(async (req, res, next) => {});

// add comment

exports.addComment = catchAsync(async (req, res, next) => {});

// update comment

exports.updateComment = catchAsync(async (req, res, next) => {});

// delete comment

exports.deleteComment = catchAsync(async (req, res, next) => {});
