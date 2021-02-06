const express = require('express');
const router = express.Router()
const { Rental, validate } = require('../models/Rental')
const { item } = require('../models/item')
const { Customer } = require('../models/Customer')
const Fawn = require('fawn')
const mongoose = require('mongoose')

Fawn.init(mongoose)

router.get('/', async (req, res) => {
    const rental = await Rental.find({})
    res.send(rental)
})

router.post('/', async (req, res) => {
    console.log('req ', req.body.customerId, req.body.itemId);
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const item = await item.findById(req.body.itemId)
    if(!item) res.status(404).send('No item found')

    const customer = await Customer.findById(req.body.customerId)
    if(!customer) res.status(404).send('No customer found')

    const rental = new Rental({
        item: {
            _id: item._id,
            title: item.title,
            dailyRentalRate: item.dailyRentalRate
        },
        customer: {
            _id: customer._id,
            name: customer.name,
            phone: customer.phone
        }
    })
        
    res.send(rental)
})

router.put('/:id', async (req, res) => {

})

router.delete('/:id', async (req, res) => {
    const rental = await Rental.findOneAndDelete(req.params.id)
    if (!rental) res.status(400).send('Wrong rental Id')
    res.send(rental)
})

router.get('/:id', async (req, res) => {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const rental = await Rental.findById(req.params.id)
    if (!rental) res.status(400).send('Wrong rental Id')
    res.send(rental)
})
module.exports = router
