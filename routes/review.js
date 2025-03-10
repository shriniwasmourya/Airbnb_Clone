const express = require('express');
const router = express.Router({mergeParams : true});
const wrapAsync = require('../utils/wrapAsync.js');
const ExpressError = require('../utils/ExpressError.js');
const {listingSchema , reviewSchema} = require('../schema.js');
const Listing = require("../model/listing.js");
const review = require('../model/review.js');
const {reviewValidate, isReviewAuthor, isLoggedin} = require("../middleware.js");
const { createReview, destroyReview } = require('../Controller/review.js');





//Review Api
router.post("/" ,reviewValidate , wrapAsync(createReview));
  


//Delete Review API.
router.delete("/:reviewid" ,isLoggedin,isReviewAuthor, destroyReview)
  

  module.exports = router;