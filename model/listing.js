const mongoose = require("mongoose");
const { type } = require("os");
const { title } = require("process");
const Review = require('./review.js')

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
    default : "https://static01.nyt.com/images/2024/11/12/world/UK-building/UK-building-articleLarge.png?quality=75&auto=webp&disable=upscale",
    set: (v) => (v === "" ? "https://static01.nyt.com/images/2024/11/12/world/UK-building/UK-building-articleLarge.png?quality=75&auto=webp&disable=upscale" : v),
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
  },
  review : [
    {
      type : mongoose.Schema.Types.ObjectId,
      ref: "Review",
    }
  ]
});

listingSchema.post("findOneAndDelete" , async(Listing) => {
  if(Listing){

    await Review.deleteMany({_id : {$in : Listing.review}});
  }
})

const Listing = new mongoose.model("Listing" , listingSchema)

module.exports = Listing;