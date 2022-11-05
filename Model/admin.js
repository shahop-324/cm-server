const mongoose = require("mongoose");

const adminSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
  },
  email: {
    type: String,
    unique: true,
  },
  avatar: {
    type: String,
  },
  password: {
    type: String,
  },
  passwordChangedAt: {
    // unselect
    type: Date,
  },
  updatedAt: {
    // unselect
    type: Date,
  },
  createdAt: {
    // unselect
    type: Date,
  },
});

adminSchema.index({
  email: "text",
});

adminSchema.methods.changedPasswordAfter = function (JWTTimeStamp) {
  if (this.passwordChangedAt) {
    const changedTimeStamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );
    return JWTTimeStamp < changedTimeStamp;
  }

  // FALSE MEANS NOT CHANGED
  return false;
};

const Admin = new mongoose.model("Admin", adminSchema);
module.exports = Admin;
