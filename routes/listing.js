const express = require('express');
const router = express.Router();
const wrapAsync = require('../utils/wrapAsync.js');
const ExpressError = require('../utils/ExpressError.js');
const Listing = require("../model/listing.js");
const {isLoggedin, isOwner , validateJoi} = require("../middleware.js");
const { populate } = require('../model/review.js');
const { index, newFromRender, ShowListing, createListing, renderEditFrom, deleteListing, updateListing } = require('../Controller/listing.js');


//Index Route
router.get("/", wrapAsync(index));

  //New Route
router.get("/new", isLoggedin , newFromRender);

  //Show Route
  router.get("/:id", isLoggedin , ShowListing);


//Create Route
router.post("/",isLoggedin, validateJoi ,wrapAsync(createListing));
  
  //edit Route
  
  router.get("/:id/edit",renderEditFrom);
  
  //Delete Route
  router.delete('/:id' , isLoggedin, isOwner ,deleteListing);
    
  //update Route..
  router.put("/:id", isLoggedin , isOwner , updateListing);

  

  module.exports = router;