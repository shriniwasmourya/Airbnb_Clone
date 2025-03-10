const { ref } = require('joi');
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
    },
    author : {
        type : Schema.Types.ObjectId,
        ref: "User",
    }
});

/*
This is One to Many relationship 

like one post ke bahut sare comments ho skte hai..

*/


module.exports = mongoose.model("Review" , reviewSchema);