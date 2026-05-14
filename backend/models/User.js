const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({

  name: {
    type: String,
    required: true,
  },

  email: {
    type: String,
    required: true,
    unique: true,
  },

  password: {
    type: String,
    required: true,
  },

  profilePic: {
    type: String,
    default: "",
  },

  isPremium: {
    type: Boolean,
    default: false,
  },

  subscriptionType: {
    type: String,
    default: "Free User",
  },

  premiumPlan: {
    type: String,
    default: "None",
  },

});

module.exports = mongoose.model("User", userSchema);