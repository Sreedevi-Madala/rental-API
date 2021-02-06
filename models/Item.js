const Joi = require('joi')
const mongoose = require('mongoose')
const { Schema } = mongoose

const itemSchema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        minlength: 5,
        maxlength: 50
    },
    type: {
        type: String,
        required: true
    },
    manufactureDate: {
        type: Date,
        required: true,
        minlength: 0,
        maxlength: 255
    },
    dailyRentalRate: {
        type: Number,
        required: true,
        min: 0,
        max: 255
    },
    ActualRate: {
        type: Number,
        required: true,
        min: 0,
        max: 255
    },
    OwnerId:  {
        id: String,
        required: true,
        min: 0,
        max: 255
    }

})

function validateitem(item) {
    const schema = {
        title: Joi.string().min(5).max(50).required(),
        genreId: Joi.objectId().required(),
        numberInStock: Joi.number().min(0).max(255).required(),
        dailyRentalRate: Joi.number().min(0).max(255).required()
    }
    return Joi.validate(item, schema)
}

const item = mongoose.model('items', itemSchema)
exports.item = item
exports.itemSchema = itemSchema
exports.validate = validateitem
