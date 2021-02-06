const express = require('express');
const router = express.Router()
const { item, validate } = require('../models/item')
const validateObjectId = require('../middlewares/validateObjectId');
const auth = require('../middlewares/auth');
const { Rental, validate } = require('../models/Rental');

router.get('/', async (req, res) => {
    const item = await item.find({})
    res.send(item)
})

router.post('/', auth, async (req, res) => {
    console.log('req', req.body);
    const { error } = validate(req.body)
    if (error) res.status(400).send(error.details[0].message)

    const item = new item({
        name: req.body.name,
        type: req.body.type,
        manufactureDate: req.body.manufactureDate,
        dailyRentalRate: req.body.dailyRentalRate,
        ActualRate: req.body.ActualRate,
        OwnerId: req.body.userID
    })
    await item.save()
    res.send(item)
})

router.put('/:id', async (req, res) => {
    //validation to delete only if not rented already
    const rented = await Rental.filter((rental)=>{
        return rental.item.id == req.params.id;
    });
        
        
    if(rented.length===0)
    {
    const { error } = validate(req.body)
    if (error) res.status(404).send(error.details[0].message)

    const item = await item.findByIdAndUpdate(req.params.id, {
        name: req.body.name,
        type: req.body.type,
        manufactureDate: req.body.manufactureDate,
        dailyRentalRate: req.body.dailyRentalRate,
        ActualRate: req.body.ActualRate,
        OwnerId:req.body.userID
    }, {new: true})
    
    if (!item) res.status(404).send('No item found')
    res.send(item)
    }
    else{
        res.status(404).send('Item already rented')
    }
})

router.delete('/:id', async (req, res) => {
    //delete only if not rented already
    const rented = await Rental.filter((rental)=>{
        return rental.item.id == req.params.id;
    });
    if(rented.length===0)
    {
    const item = await item.findByIdAndDelete(req.params.id)
    if (!item) res.status(404).send('No item found')
    res.send(item)
    }
    else{
        res.status(404).send('Item already rented')
    }
})

router.get('/:id', validateObjectId, async (req, res) => {
    const item = await item.findById({_id: req.params.id})
    if (!item) return res.status(404).send('The item with the given ID was not found.')
    res.send(item)
})
module.exports = router
