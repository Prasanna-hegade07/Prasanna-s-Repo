const mongoose = require("mongoose");

const SongSchema = new mongoose.Schema({

  title: {
    type: String,
    required: true
  },

  artist: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Artist",
    required: true
  },

  category: {
    type: String,
    required: true
  },

  image: {
    type: String
  },

  audio: {
    type: String
  }

}, { timestamps: true }); 

module.exports = mongoose.model("Song", SongSchema);