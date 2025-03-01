const mongoose = require('mongoose');
const {Schema} = require('mongoose');

const reviewSchema = new Schema({
    comment : String,
    rating : {
        type :String , 
        min :1,
        max : 5,
    },
    createAt : {
        type : Date,
        default : Date.now(),
    }

});

/*
This is One to Many relationship 

like one post ke bahut sare comments ho skte hai..

*/


module.exports = mongoose.model("Review" , reviewSchema);