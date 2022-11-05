const Newsletter = require("../Model/newsletter");
const User = require("../Model/user");
const catchAsync = require("../utils/catchAsync");

// update user profile
exports.updateMe = catchAsync(async (req, res, next) => {
  const updated_user = await User.findByIdAndUpdate(
    req.id,
    { ...req.body },
    { new: true, validateModifiedOnly: true }
  );
  res.status(200).json({
    status: "success",
    message: "Account updated Successfully!",
    data: updated_user,
  });
});

// get user profile

exports.getMe = catchAsync(async (req, res, next) => {
  const user_doc = await User.findById(req.id);
  res.status(200).json({
    status: "success",
    message: "User found Successfully!",
    data: user_doc,
  });
});

// delete user account

exports.deleteMe = catchAsync(async (req, res, next) => {
  // remove from newsletter
  await Newsletter.findOneAndDelete({ email: req.user.email });

  // then delete account
  await Newsletter.findByIdAndDelete(req.id);

  res.status(200).json({
    status: "success",
    message: "Account Deleted Successfully!",
  });
});

exports.subscribeNewsletter = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(
    req.id,
    {
      subscribed_newsletter: true,
    },
    { validateModifiedOnly: true }
  );
  await Newsletter.create({
    user: req.id,
    email: req.user.email,
  });
  res.status(200).json({
    status: "success",
    message: "Subscribed to newsletter Successfully!",
  });
});

exports.unsubscribeNewsletter = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(
    req.id,
    {
      subscribed_newsletter: false,
    },
    { validateModifiedOnly: true }
  );
  await Newsletter.findOneAndDelete({
    user: req.id,
    email: req.user.email,
  });
  res.status(200).json({
    status: "success",
    message: "Unsubscribed to newsletter Successfully!",
  });
});
