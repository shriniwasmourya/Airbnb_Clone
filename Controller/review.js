const Listing = require("../model/listing");
const review = require("../model/review");

// module.exports.createReview = async (req, res) => {
//     req.flash("success" , "Listing Updated succesfully!");
//     const editvalue = new Listing(req.body.listing);
//     let { id } = req.params;
//     if(!req.params.id){
//       throw new ExpressError(404 , "Plese fill valid data!");
//     }
//     id = id.replace(/[${}`]/g, "");

   
//     let updateDetails = await Listing.findByIdAndUpdate(id, {
//       ...req.body.listing,
//     });
//     return res.redirect(`/listing/${id}`);
//   }


  module.exports.createReview = async (req , res)=>{
    req.flash("success" , "Review Added");
      let {id} = req.params;
      // id = id.replace(/[${}`]/g, "");
      let listing = await Listing.findById(req.params.id);
      let newReview = new review(req.body.review);
      listing.review.push(newReview);
      newReview.author = req.user._id;
      console.log(newReview);
      await newReview.save();
      await listing.save();
    
      res.redirect(`/listing/${id}`);
      // res.send("Review receive successfylly , plese go back for further processed..");
    }

    module.exports.destroyReview = async(req , res ) => {
        req.flash("success" , "Review Deleted succesfully!");
          console.log("Review delete request receive.");
          let {id , reviewid} = req.params;
          id = id.replace(/[${}`]/g, "");
          reviewid = reviewid.replace(/[${}`]/g, "");
          let result = await Listing.findByIdAndUpdate(id , {$pull : {review : reviewid}});   //pull method delete the specified array ele when conditono match {like linsting ke andr se review array se us review ko dlt krdena..}
          console.log(reviewid);
          let dlt = await review.findByIdAndDelete(reviewid);
          console.log(dlt);
          res.redirect(`/listing/${id}`);
        };