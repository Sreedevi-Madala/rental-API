const customers = require('../routes/customers')
const items = require('../routes/items')
const rentals = require('../routes/rentals')
const users = require('../routes/users')
const auth = require('../routes/auth')
const error = require('../middlewares/error')
const bodyParser = require('body-parser')

module.exports = function (app) {
    app.use(bodyParser.json())
    app.use('/api/customers', customers)
    app.use('/api/items', items)
    app.use('/api/rentals', rentals)
    app.use('/api/users', users)
    app.use('/api/auth', auth)
    app.use(error)
}
