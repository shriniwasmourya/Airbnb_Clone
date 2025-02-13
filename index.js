const express = require("express");
const method = require("method-override");
const mongoose = require("mongoose");
const path = require("path");
const Listing = require("./model/listing.js");
const ejsMate = require("ejs-mate");
const wrapAsync = require('./utils/wrapAsync.js')
const ExpressError = require('./utils/ExpressError.js');
const {listingSchema} = require('./schema.js');

const app = express();
app.use(method("_method"));

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.engine('ejs' , ejsMate);

//for static files like css 
app.use(express.static(path.join(__dirname , "/public")))

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//Moongose basic setup

async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/airbnb");
}

main()
  .then((res) => {
    console.log("Connection successfully established!");
  })
  .catch((err) => {
    console.error(err);
  });

app.get("/", async (req, res) => {
  console.log("Root page request received!");
  let lists = await Listing.find();
  // console.log(data);
  res.render("./listing/index.ejs", { lists });
});

app.listen(3600, () => {
  console.log("Server start at port 3600");
});

app.get("/testListing", (req, res) => {
  let user1 = new Listing({
    title: "My new Villa",
    description: "My new house",
    price: 23500,
    location: "Gwalior",
    country: "INDIA",
  });

  user1
    .save()
    .then((res) => {
      console.log("First entry saved successully");
      console.log(res._id);
    })
    .catch((err) => console.log(err));

  res.send("successfully testing");
});

app.put("/listing/:id", async (req, res) => {
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

app.get("/listing/new", (req, res) => {
  console.log("OK");
  res.render("./listing/addnew.ejs");
});


/*Joi function to validate data */

const validateJoi = (req , res , body) => {
  let {error} = listingSchema.validate(req.body);

  if(error){
    let errmsg = error.details.map((e)=>e.message).join(",");
    throw new ExpressError(404 , errmsg);
  }

}






app.post("/", validateJoi ,wrapAsync(async(req, res , next) => {
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

//middleware to handle async

app.use((err , req , res , next)=>{
  console.log("Something went wrong..");
  let {statusCode=500 , message="Wrong"} = err;
  console.log(err.message);
  res.status(statusCode).render('error.ejs' , {err})
})




app.get("/listing/:id", validateJoi , (req, res) => {
  let { id } = req.params;
  let idc = id.replace(/[${}`]/g, "");
  let list = {};
  Listing.findById(id)
    .then((list) => {
      res.render("./listing/post.ejs", { list });
    })
    .catch((err) => {
      console.log(err);
    });
});

app.get("/listing/:id/edit",validateJoi ,async (req, res) => {
  let { id } = req.params;
  id = id.replace(/[${}`]/g, "");
  let list = await Listing.findById(id);
  res.render("./listing/edit.ejs", { list });
});

//Delete Route

app.delete('/listing/:id' ,validateJoi, (req , res) => {
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


//if no route mactch then through page not found error 

app.all('*' , (req , res , next) => {
  next(new ExpressError(404 , "Page not Found"));
})

app.use((err , req ,res , next) => {
  let {statusCode=500 , message = "Something went Wrong!"} = err;
  console.log(message);
  // res.status(statusCode).send(message);
  res.render('error.ejs' , {err})
})