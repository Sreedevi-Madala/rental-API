const _ = require('lodash')
const express = require('express');
const router = express.Router()
const { User, validate } = require('../models/User')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const config = require('config')
const auth = require('../middlewares/auth')

router.get('/me', auth, async (req, res) => {
    const user = await User.findById(req.user._id).select('-password')
    res.send(user)
})

router.post('/', async (req, res) => {
    const { error } = validate(req.body)
    if (error) return res.status(400).send(error.details[0].message)

    let user = await User.findOne({email: req.body.email})
    if (user) res.status(400).send('The Email registered already')

    user = new User(_.pick(req.body, ['name', 'email', 'password']))
    const salt = await bcrypt.genSalt(10)
    user.password = await bcrypt.hash(req.body.password, salt)
    await user.save()

    const picked = _.pick(user, ['_id', 'name', 'email'])

    const token = user.generateAuthToken()
    res.header('x-auth-token', token).send(picked)

})

router.put('/:id', async (req, res) => {

    const { error } = validate(req.body)
    if (error) return res.status(400).send(error.details[0].message)
    try {
        const user = await User.findByIdAndUpdate(req.params.id, {
            name: req.body.name,
            email: req.body.email,
            password: req.body.password
        }, {new: true})
    }
    catch (er) {
        console.log('er', er);
    }

    if (!customer) return res.status(404).send('The customer was not found')
    res.send(customer)
})


router.delete('/:id', async (req, res) => {
    const user = await User.findOneAndDelete(req.params.id)
    if (!user) res.status(400).send('Wrong user Id')
    res.send(user)
})

module.exports = router
