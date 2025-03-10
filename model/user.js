const passportLocalMongoose = require("passport-local-mongoose");
const mongoose = require("mongoose");
const { required } = require("joi");
const Schema = mongoose.Schema;

const userSchema = new Schema({
    email : {
        type : String, 
        required : true,
    }
    ,

    //user and password filed autom. created by the passport middleware {no need to mention };
    //pbkdf hashing algo use in passport middllwware..
});

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User" , userSchema);