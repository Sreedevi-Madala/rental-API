const Joi = require('joi')
const mongoose = require('mongoose')
const { Schema } = mongoose
const { customerSchema } = require('./Customer')

const rentalSchema = new Schema({
    customer: {
        type: customerSchema,
        required: true
    },
    item: {
        type: new mongoose.Schema({
            name: {
                type: String,
                required: true,
                trim: true,
                minlength: 5,
                maxlength: 50
            },
            dailyRentalRate: {
                type: Number,
                required: true,
                min: 0,
                max: 255
           },
        }),
        required: true
    },
    dateOut: {
        type: Date,
        required: true,
        default: Date.now
    },
    dateReturned: {
        type: Date
    },
    rentalFee: {
        type: Number,
        min: 0
    }

})

const Rental = mongoose.model('rentals', rentalSchema)

function validateRental(rental) {
    const schema = {
        customerId: Joi.objectId().min(5).max(50).required(),
        itemId: Joi.objectId().min(5).max(50).required(),
    }
    return Joi.validate(rental, schema)
}


exports.Rental = Rental
exports.validate = validateRental
