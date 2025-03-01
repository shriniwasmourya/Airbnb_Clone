const express = require('express');
const router = express.Router({mergeParams : true});
const wrapAsync = require('../utils/wrapAsync.js');
const ExpressError = require('../utils/ExpressError.js');
const {listingSchema , reviewSchema} = require('../schema.js');
const Listing = require("../model/listing.js");
const review = require('../model/review.js');



/*Joi function to validate data */
const reviewValidate = (req , res , next) => {
    let {error} = reviewSchema.validate(req.body);
    if(error){
      let errmsg = error.details.map((e) => e.message).join(",");
      return next(new ExpressError(400 , errmsg));
    }
    next();
  }

//Review Api
router.post("/" ,reviewValidate , wrapAsync(async (req , res)=>{
    let {id} = req.params;
    // id = id.replace(/[${}`]/g, "");
    let listing = await Listing.findById(req.params.id);
    let newReview = new review(req.body.review);
    listing.review.push(newReview);
  
    await newReview.save();
    await listing.save();
  
    res.redirect(`/listing/${id}`);
    // res.send("Review receive successfylly , plese go back for further processed..");
  }));
  


//Delete Review API.
router.delete("/:reviewid" , async(req , res ) => {
    console.log("Review delete request receive.");
    let {id , reviewid} = req.params;
    id = id.replace(/[${}`]/g, "");
    reviewid = reviewid.replace(/[${}`]/g, "");
    let result = await Listing.findByIdAndUpdate(id , {$pull : {review : reviewid}});   //pull method delete the specified array ele when conditono match {like linsting ke andr se review array se us review ko dlt krdena..}
    console.log(reviewid);
    let dlt = await review.findByIdAndDelete(reviewid);
    console.log(dlt);
    res.redirect(`/listing/${id}`);
  })
  

  module.exports = router;