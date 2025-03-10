const mongoose = require('mongoose');
const express = require('express');
const initData = require('./data.js');
const Listing = require('../model/listing.js');



async function main() {
    await mongoose.connect("mongodb://127.0.0.1:27017/airbnb");
}



main()
.then(res=>{
    console.log("Connection successfully established!")
})
.catch(err => {
    console.error(err);
})


const initDB = async () => {
    await Listing.deleteMany({});
    initData.data = initData.data.map((obj) => ({...obj , owner : "67c418b7cf58955343937514"}))
    await Listing.insertMany(initData.data);
    console.log("DAta was initialize");
}


initDB();