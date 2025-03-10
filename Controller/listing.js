const Listing = require('../model/listing')


module.exports.index = async (req, res) => {
    console.log("Root page request received!");
    let lists = await Listing.find();
    // console.log(data);
    res.render("./listing/index.ejs", { lists });
  }

module.exports.newFromRender = (req, res) => {
    console.log("OK");
    
    res.render("./listing/addnew.ejs");
  }

  module.exports.ShowListing = async (req, res, next) => {
    try {
      let { id } = req.params;
      id = id.replace(/[${}`]/g, ""); // Sanitize ID
  
      let list = await Listing.findById(id)
      .populate({path : "review"
      , populate : {
        path : "author",
      }})
      .populate("owner"); // Populate reviews
  
      if (!list) {
        req.flash("error" , "Listing you requestiong for update does not exit");
        return res.redirect("/listing")
        // return next(new ExpressError(404, "Listing not found"));
      }
  
     return res.render("./listing/post.ejs", { list });
    } catch (err) {
      next(err); // Pass error to middleware
    }
  }


  module.exports.createListing = async(req, res , next) => {
    req.flash("success" , "New Listing created Now succesfully!");
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
      
      user.owner = req.user._id;
  
      await user
        .save()
        .then((res) => {
          console.log(res);
        })
        // .catch((err) => {
        //   console.log(err);
        // });
      return res.redirect("/listing");
      }catch(err){
        // next(new ExpressError(404 , "Something WentWrong!"));
        next(err);
      }
    }


    module.exports.renderEditFrom = async (req, res) => {
        let { id } = req.params;
        req.flash("success" , "Edit you post here");
        id = id.replace(/[${}`]/g, "");
        let list = await Listing.findById(id);
    
        if (!list) {
          req.flash("error" , "Listing you requestiong for does not exit");
          return res.redirect("/listing")
        }
    
        return res.render("./listing/edit.ejs", { list });
      }

      module.exports.deleteListing = (req , res) => {
        let {id} = req.params;
        console.log(id);
        req.flash("success" , "Listing has been deleted succesfully!");
        Listing.findByIdAndDelete(id).then(result => {
          console.log(result);
         return res.redirect('/listing');
        })
        .catch(err => {
          console.log(err);
        })
      };


      module.exports.updateListing = async (req, res) => {
        req.flash("success" , "Listing Updated succesfully!");
        const editvalue = new Listing(req.body.listing);
        let { id } = req.params;
        if(!req.params.id){
          throw new ExpressError(404 , "Plese fill valid data!");
        }
        id = id.replace(/[${}`]/g, "");
    
       
        let updateDetails = await Listing.findByIdAndUpdate(id, {
          ...req.body.listing,
        });
        return res.redirect(`/listing/${id}`);
      };