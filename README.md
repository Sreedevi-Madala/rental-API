# item-Rental-REST-API

## Installation and Test
1. [Live-demo](http://morning-mesa-94967.herokuapp.com/)
    - Visit one of API Endpoints
    - Use POSTMAN or other tools to test API Endpoints
    (to test - /api/users, auth token is necessary. Checkout #3 How To Create an Auth Token with POSTMAN)

2. Local Test Clone or Download the project
    - npm install
    - In terminal(Mac), export movie_jwtPrivateKey=anykey (without this, the app will crash)
    - Run MongoDB locally
    - npm run dev or start
    - Visit http://localhost:3000/ + API Endpoints
    - npm test

3. How To Create an Auth Token with POSTMAN
    - At http://localhost:3000/api/users/
    - Send POST method with below information
```
{
	"name": "moogun",
	"email": "test@gmail.com",
	"password": "12345"
}
```

    - In the response, check out the headers. You will find 'x-auth-token'
    - At http://localhost:3000/api/genres/, Copy and paste the token to the header with 'x-auth-token' as a key and token as a value
    - In the body, choose raw, then JSON. Add data like below with genreSchema in mind

```
{
	"name": "Thriller"
}
```
GenreSchema
```
const genreSchema = new Schema({
    name: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 50
    }
})

```


## API Endpoints
    - /api/genres
    - /api/items
    - /api/customers
    - /api/rentals
    - /api/users


## Test Samples
**1. Unit Test for Token Generation**

models/User
```
userSchema.methods.generateAuthToken = function () {
    const token = jwt.sign({_id: this._id, isAdmin: this.isAdmin}, config.get('jwtPrivateKey'))
    return token
}
```

tests/unit/users.test.js
```
describe('user.generateAuthToken', () => {
    it('should return a valid JWT', () => {
        const payload = {_id: new mongoose.Types.ObjectId().toHexString(), isAdmin: true}
        const user = new User(payload)
        const token = user.generateAuthToken()
        const decoded = jwt.verify(token, config.get('jwtPrivateKey'))
        expect(decoded).toMatchObject(payload)
    })
})

```

**2.Integration Test by Setting Auth Token in the Header**

tests/integration/users.test.js
```
beforeEach(() => { server = require('../../index')})
afterEach(async () => {
    await server.close()
    await Genre.remove({})
})
...

it('should save the genre if it is valid', async () => {
    const token = new User().generateAuthToken()
    const res = await request(server).post('/api/genres')
    .set('x-auth-token', token)
    .send({name: 'genre1'})
    const genre = Genre.find({name: 'genre1'})

    expect(genre).not.toBeNull()
})
```


## Error Log Samples
**1. UncaughtException Error**

log/exceptions.log
```
2018-10-23 15:44:20 [31merror[39m: uncaughtException: an error thrown for a test
Error: an error thrown for a test
    at Timeout.setTimeout [as _onTimeout] (/Users/moogunjung/Downloads/item/index.js:18:11)
    at ontimeout (timers.js:498:11)
    at tryOnTimeout (timers.js:323:5)
    at Timer.listOnTimeout (timers.js:290:5)
```

startup/logging.js
```
exceptionHandlers: [
    new transports.File({
        filename: exceptions.log,
    })
  ]
```

**2. Promise Rejection Error**

log/results.log
```
2018-10-23 15:44:20 [31merror[39m:  Promise rejection error thrown for a test
```

startup/logging.js
```
...
format: format.combine(format.colorize(),
    format.timestamp({
      format: 'YYYY-MM-DD HH:mm:ss'
    }),
    format.printf(info => `${info.timestamp} ${info.level}: ${info.message}`)
    // format.json()
),
```

**3. Async Error in the API Request Pipeline**

routes/genres.js
```
router.get('/', async (req, res, next) => {
    // throw new Error('genres / error thrown')
    const genres = await Genre.find({})
    res.send(genres)
})

```

middlewares/error.sj
```
module.exports = function (err, req, res, next) {
    winston.error(err.message, err)
    res.status(500).send('something failed')
    next()
}
```

## Credit
This project is based on Mosh Hamedani's Udemy Course [Node.js: The Complete Guide to Build RESTful APIs (2018)](https://www.udemy.com/nodejs-master-class/learn/v4/overview)
