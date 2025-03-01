const express = require("express");
const router = express.Router({mergeParams : true});
const cookieParser = require('cookie-parser');

  router.use(cookieParser("dhundlebete"));




  //Cookies : small block of data that cret by web server while user broweing a website and stred in locl systm

  router.get("/" , (req , res) => {
    res.cookie("Namaste" , "GuruJi" , {signed:true}); 
    res.cookie("Greet"  , "How are you" , {signed:true});
    res.send("Cookies Submit successfully");
  })

  //Verify cookies 

  router.get("/verify" , (req , res) => {
    // console.log(req.cookies);    //for unsigned cookies
    console.log(req.signedCookies);
    res.send("Signed cookies checkedchecked✅")
  })

  //signed or unsigned cookies ko alg se divided kr deta h
  //Unsigned cookies : req.cookies se print krba skte hai
  //Singed cookies : req.signedCookies se print krba skte hia.

  //How to greet user with name using cookies

  router.get('/greet' , (req , res) => {
    let {name = "Anonymous"} = req.cookies;
    res.send(`Hi ${name}`);
  })


  //Signed Cookies : esi cookie jiske upr seel  , stamb lg gyi ho 
  //normal cookies ko koi bhi change kr skta h broweser me isse backne k liye
  //hum singed krte h cookies ko jisse koi temper (ched / change) na kr paye

  //2 step process of signed cookies

  router.get("/signed" , (req , res) => {
    res.cookie("made-In : " , "Inida" , {signed : true});
    res.send("Signed cookies send successfully");
  })


  module.exports = router;