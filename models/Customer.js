const Joi = require('joi')
const mongoose = require('mongoose')
const { Schema } = mongoose

const customerSchema = new Schema({
    name: {
        type: String,
        minlength: 5,
        maxlength: 50
    },
    phone: {
        type: String,
        minlength: 5,
        maxlength: 50
    }

})

function validateCustomer(customer) {
    const schema = {
        name: Joi.string().min(5).max(50).required(),
        phone: Joi.string().min(5).max(50).required()
    }
    return Joi.validate(customer, schema)
}

const Customer = mongoose.model('customers', customerSchema)
exports.Customer = Customer
exports.customerSchema = customerSchema
exports.validate = validateCustomer
