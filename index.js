const express = require("express");
const method = require("method-override");
const mongoose = require("mongoose");
const path = require("path");
const Listing = require("./model/listing.js");
const ejsMate = require("ejs-mate");
const wrapAsync = require('./utils/wrapAsync.js')
const ExpressError = require('./utils/ExpressError.js');
const { listingSchema, reviewSchema } = require('./schema.js');    //grey clr bcz this method not used in this file
const review = require("./model/review.js");
const listingRouter = require("./routes/listing.js")
const reviewRouter = require('./routes/review.js')
const userRouter = require("./routes/user.js");
const cookie = require('./routes/cookies.js');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const flash = require('connect-flash');
const { name } = require("ejs");
const passport = require('passport');
const localStrategy = require('passport-local');
const User = require('./model/user.js');



const app = express();
app.use(method("_method"));

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.engine('ejs', ejsMate);

//for static files like css 
app.use(express.static(path.join(__dirname, "/public")))

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//Moongose basic setup

async function main() {
  // await mongoose.connect("mongodb://127.0.0.1:27017/airbnb");
  awit mongoose.connect("mongodb+srv://airbnb:airbnb123@airbnb.ip8tf.mongodb.net/?retryWrites=true&w=majority&appName=airbnb");
}

main()
  .then((res) => {
    console.log("Connection successfully established!");
  })
  .catch((err) => {
    console.error(err);
  });


//Cookies : small block of data that cret by web server while user broweing a website and stred in locl systm

app.use('/getcookies', cookie);

app.use(cookieParser());


app.listen(3600, () => {
  console.log("Server start at port 3600");
});



//Express Session 

app.use(session({ secret: "secretcodeencodewithrandomeword",
   resave: false,
  saveUninitialized: false,
  cookie : {
    expires : Date.now() + 7 * 24 * 60 * 60 * 1000,
    maxAge : 7 * 24 * 60 * 60 * 1000,
    httpOnly :true,
  }

 }));
app.use(flash());   //sirf itna krne se isko use kr skte hai..

/* Configuring Strategy */
//

app.use(passport.initialize());   //isse har ek req kliye passport initialize ho jayega..

app.use(passport.session())     //user jab page to page request send krta h to passport ko pta hona chahiye same uer h ya different uer

passport.use(new localStrategy(User.authenticate()));   
/* JO bhi hmara user aaya , request aaye , wo localStratefy ke through authentic hone chahiye , user ko 
authentic krne ke liye {authentic} method use hoga , Auth : mtlb user ko login/signup krbana */


passport.serializeUser(User.serializeUser());
/* User se realted jitne bhi info hai age session ke andr store krbana h usko bolte hai serialze */


passport.deserializeUser(User.deserializeUser());
/* User se realted jitne bhi info hai age session ke andr se delete/Htani hai  usko bolte hai deserialze */
 




app.get("/session", (req, res) => {

  res.send('Session successfully');
})

//how to track session request 

app.get("/requestcount", (req, res) => {
  if (req.session.count) {
    req.session.count++;
  } else {
    req.session.count = 1;
  }

  res.send(`request count received ${req.session.count} times`);
  //every time you refreshed , no. of req increase but session to ek he hai bs req inc/dec hoti rehti hai
})


//isko kese store or use kr skte hai website me 

// app.get("/register" , (req , res) => {
//   // req.flash("success" , "User Session created successsfully");

//   // if(req.session.name == 'anonymous'){

//   // }
//   // req.flash("error" , "User not registered!");

//   let {name = "Anonymous"} = req.query;
//   console.log(req.session);
//   req.session.name = name;
//   // res.send(`${name}`);
//   res.redirect('/hello')
// })


//we use middleware to use res.local msgs..

// app.use((req , res , next) => {
// //res.locals : used to store var for render lke name in this case
// // res.locals.successMsg = res.flash("success");
// // res.locals.errorMsg = res.flash("error");

// next();

// })

// app.get("/hello" , (req , res) => {
//   // res.send(`Hello ${req.session.name}`);



//   res.render("flash.ejs" , {name : req.session.name});
// })

//Connect flash : ye jab bhi koi chez hoti hai ek msh pop hokr aata hai..
//like alert , or something like that..




app.get("/testListing", (req, res) => {
  console.log(req.cookies);
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

app.use((req , res , next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currentUser = req.user;
  next();
})

//Demo user for tesitng passport

app.get("/demouser" , async(req , res) =>{
  let fakeUser = new User({
    email : "fakeuser@gmail.com",
    username : "fakeuser",
  });


  let regUser = await User.register(fakeUser , "123@abc");    //auto check if username differnt or not
  res.send(regUser);
})



app.use("/listing", listingRouter);
app.use('/listing/:id/review', reviewRouter);
app.use("/" , userRouter);

//middleware to handle async

app.use((err, req, res, next) => {
  console.log("Something went wrong..");
  let { statusCode = 500, message = "Wrong" } = err;
  console.log(err.message);
  res.status(statusCode).render('error.ejs', { err })
})





//if no route match then through page not found error 

app.all('*', (req, res, next) => {
  next(new ExpressError(404, "Page not Found"));
})

app.use((err, req, res, next) => {
  let { statusCode = 500, message = "Something went Wrong!" } = err;
  // console.log(message);
  // res.status(statusCode).send(message);
  res.render('error.ejs', { err })
})
