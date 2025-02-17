const mongoose = require('mongoose');
const express = require('express');
const initData = require('./data.js');
const Listing = require('../model/listing.js');



async function main() {
    await mongoose.connect("mongodb+srv://airbnb:0UCUnRTaavBgo9CT@airbnb.ip8tf.mongodb.net/?retryWrites=true&w=majority&appName=airbnb");
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

    await Listing.insertMany(initData.data);
    console.log("DAta was initialize");
}


initDB();