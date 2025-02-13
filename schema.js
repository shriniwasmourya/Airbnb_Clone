const joi = require('joi');

module.exports.listingSchema = joi.object({
    title: joi.string().required(),
    description: joi.string().required(),
    price: joi.number().required().min(0),
    location: joi.string().required(),
    country: joi.string().allow("" ,null),
    image: joi.string().allow("", null)
});
