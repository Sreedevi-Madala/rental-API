//This catches exceptions in the request processing pipeline only
const winston = require('winston')

module.exports = function (err, req, res, next) {
    //winston.log('login level') or
    winston.error(err.message, err)

    // #. loging level
    // error
    // warn
    // info
    // verbose
    // debug
    // silly
    res.status(500).send('something failed')
    next()
}
