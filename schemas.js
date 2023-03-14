const Joi = require('joi');

module.exports.kidgroundSchema = Joi.object({
    kidground: Joi.object({
        title: Joi.string().required(),
        location: Joi.string().required(),
        // image: Joi.string().required(),
        price: Joi.number().required().min(0),
        description: Joi.string().required()
    }).required(),
    deleteImages: Joi.array()
});

module.exports.reviewSchema = Joi.object({
    review: Joi.object({
        rating: Joi.number().required().max(5).min(1),
        body: Joi.string().required()
    }).required()
})
