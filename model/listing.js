const mongoose = require("mongoose");
const { type } = require("os");
const { title } = require("process");
const Review = require('./review.js');
const User = require('./user.js');

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
    default : "https://media.architecturaldigest.com/photos/5679d4bc7fd9a58978b7c95e/16:9/w_2560%2Cc_limit/tour-nycs-first-zaha-hadid-designed-apartment-building-18.jpg",
    set: (v) => (v === "" ? "https://media.architecturaldigest.com/photos/5679d4bc7fd9a58978b7c95e/16:9/w_2560%2Cc_limit/tour-nycs-first-zaha-hadid-designed-apartment-building-18.jpg" : v),
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
  ],

  owner : {
    type : mongoose.Schema.Types.ObjectId,
    ref : "User"
  }
});

listingSchema.post("findOneAndDelete" , async(Listing) => {
  if(Listing){

    await Review.deleteMany({_id : {$in : Listing.review}});
  }
})

const Listing = new mongoose.model("Listing" , listingSchema)

module.exports = Listing;