const mongoose = require("mongoose");

const ArtistSchema = new mongoose.Schema({

  name: {
    type: String,
    required: true
  },

  image: {
    type: String,
    required: true
  },

  dob: {
    type: String,
    required: true
  },

  monthlyListeners: {
    type: Number,
    default: 0
  }

}, { timestamps: true }); 

module.exports = mongoose.model("Artist", ArtistSchema);