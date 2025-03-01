const express = require('express');
const router = express.Router();
const wrapAsync = require('../utils/wrapAsync.js');
const ExpressError = require('../utils/ExpressError.js');
const {listingSchema , reviewSchema} = require('../schema.js');
const Listing = require("../model/listing.js");


/*Joi function to validate data */
  //Validation Joi (it is package);
  const validateJoi = (req, res, next) => {
    let { error } = listingSchema.validate(req.body);
    if (error) {
      let errmsg = error.details.map((e) => e.message).join(",");
      return next(new ExpressError(400, errmsg)); // Proper error handling
    }
    next(); // Continue to next middleware
  };

//Index Route
router.get("/", async (req, res) => {
    console.log("Root page request received!");
    let lists = await Listing.find();
    // console.log(data);
    res.render("./listing/index.ejs", { lists });
  });

  //New Route
router.get("/new", (req, res) => {
    console.log("OK");
    res.render("./listing/addnew.ejs");
  });

  //Show Route
  router.get("/:id", async (req, res, next) => {
    try {
      let { id } = req.params;
      id = id.replace(/[${}`]/g, ""); // Sanitize ID
  
      let list = await Listing.findById(id).populate("review"); // Populate reviews
  
      if (!list) {
        return next(new ExpressError(404, "Listing not found"));
      }
  
      res.render("./listing/post.ejs", { list });
    } catch (err) {
      next(err); // Pass error to middleware
    }
  });


//Create Route
router.post("/", validateJoi ,wrapAsync(async(req, res , next) => {
    console.log("Data received!");
    try{
    let { title, description, price, image, location } = req.body;
    console.log(title);
    let user = new Listing({
      title: title,
      description: description,
      image: image,
      price: price,
      location: location,
    });
  
    await user
      .save()
      .then((res) => {
        console.log(res);
      })
      // .catch((err) => {
      //   console.log(err);
      // });
    res.redirect("/");
    }catch(err){
      // next(new ExpressError(404 , "Something WentWrong!"));
      next(err);
    }
  }));
  
  //edit Route
  
  router.get("/:id/edit",async (req, res) => {
    let { id } = req.params;
    id = id.replace(/[${}`]/g, "");
    let list = await Listing.findById(id);
    res.render("./listing/edit.ejs", { list });
  });
  
  //Delete Route
  router.delete('/:id' , (req , res) => {
    let {id} = req.params;
    console.log(id);
  
    Listing.findByIdAndDelete(id).then(result => {
      console.log(result);
      res.redirect('/');
    })
    .catch(err => {
      console.log(err);
    })
  })
    
  //update Route..
  router.put("/:id", async (req, res) => {
    const editvalue = new Listing(req.body.listing);
    let { id } = req.params;
    if(!req.params.id){
      throw new ExpressError(404 , "Plese fill valid data!");
    }
    id = id.replace(/[${}`]/g, "");
    let updateDetails = await Listing.findByIdAndUpdate(id, {
      ...req.body.listing,
    });
    res.redirect(`/listing/${id}`);
  });

  

  module.exports = router;