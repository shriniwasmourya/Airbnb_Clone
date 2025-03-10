const Listing = require('./model/listing');
const review = require('./model/review.js');
const {listingSchema , reviewSchema} = require('./schema.js');




module.exports.isLoggedin = (req , res , next) => {
    console.log(req.user);
    if(!req.isAuthenticated()){
        req.session.redirectUrl = req.originalUrl;
        req.flash("error" , "You are not Logged In , Plese login first");
        return res.redirect("/login");
        }
        next();
}

/* if user is not login / signup then if user go to login/signup page then redirect that path that click before login/signup 
we can achive using {req.originalUrl
we saved this url where we ned in this case , we save when user not login/signup
*/

//passport middleware jese he login hoga wo req.originalURl ko reset kr deta h isliye isko res.locals me stroe krege , passport isko access ni krta , access hota he nhi hai uske!

module.exports.redirectUrl = (req , res , next) => {
    if(req.session.redirectUrl) {
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
}

//Middlware for ownership

module.exports.isOwner = async(req , res , next) => {
    let { id } = req.params;
    let listing = await Listing.findById(id).populate("owner");
    if(!listing.owner._id.equals(res.locals.currentUser._id)){
      req.flash("error" , "you don't have access to edit this post");
      return res.redirect(`/listing/${id}`);
    }

    next();

}


/*Joi function to validate data */
  //Validation Joi (it is package);
  module.exports.validateJoi = (req, res, next) => {
    let { error } = listingSchema.validate(req.body);
    if (error) {
      let errmsg = error.details.map((e) => e.message).join(",");
      return next(new ExpressError(400, errmsg)); // Proper error handling
    }
    next(); // Continue to next middleware
  };



/*Joi function to validate data */
module.exports.reviewValidate = (req , res , next) => {
    let {error} = reviewSchema.validate(req.body);
    if(error){
      let errmsg = error.details.map((e) => e.message).join(",");
      return next(new ExpressError(400 , errmsg));
    }
    next();
  }

// Authorization before review delete
module.exports.isReviewAuthor = async (req, res, next) => {
  let { id, reviewid } = req.params;
  let Review = await review.findById(reviewid);
  
  // Check if Review exists
  if (!Review) {
      req.flash("error", "Review not found!");
      return res.redirect(`/listing/${id}`);
  }

  // Check if the logged-in user is the author
  if (!Review.author.equals(res.locals.currentUser._id)) {
      req.flash("error", "You are not the author of this review");
      return res.redirect(`/listing/${id}`);
  }

  next();
};
