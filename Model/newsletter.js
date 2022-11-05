const mongoose = require("mongoose");

const newsletterSchema = new mongoose.Schema({
  user: {
    type: mongoose.Types.ObjectId,
    ref: "User",
  },
  email: {
    type: String,
  },
  subscribedAt: {
    type: Date,
    default: Date.now(),
  },
});

const Newsletter = new mongoose.model("Newsletter", newsletterSchema);
module.exports = Newsletter;
