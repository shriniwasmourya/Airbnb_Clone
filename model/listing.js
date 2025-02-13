const mongoose = require("mongoose");
const { type } = require("os");
const { title } = require("process");

const listingSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  image: {
    type: String,
    // default : "default_link",
    // set: (v) => (v === "" ? "default_link" : v),
  },

  price : {
    type : Number,
    required : true,
  },

  location : {
    type : String,
  },

  country : {
    tyep : String,
  }
});

const Listing = new mongoose.model("Listing" , listingSchema)

module.exports = Listing;