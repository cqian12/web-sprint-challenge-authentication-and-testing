const router = require('express').Router();
const bcrypt = require('bcryptjs')
const db = require('../../data/dbConfig') 
const { checkPassword, checkUsernameExists, checkUsername } = require('../middleware/auth-mw')
const JWT_SECRET = 'super super secret'
const jwt = require('jsonwebtoken')

router.post('/register', checkPassword, checkUsername, async (req, res, next) => {
  try {
    const { username, password } = req.body

    const hash = bcrypt.hashSync(password, 8)

    const id = await db('users').insert({username, password:hash})
    const [newUser] = await db('users').where('id', id)
    res.status(200).json(newUser)
  } catch(err) {
    next(err)
  }
  
  //   const { username, password } = req.body

  //   const hash = bcrypt.hashSync(password, 8)
  
  //   const id = await db('users').insert({username, password:hash})
  //   const [newUser] = db('users').where('id', id)
  //   res.status(200).json(newUser)
  
  /*
    IMPLEMENT
    You are welcome to build additional middlewares to help with the endpoint's functionality.
    DO NOT EXCEED 2^8 ROUNDS OF HASHING!

    1- In order to register a new account the client must provide `username` and `password`:
      {
        "username": "Captain Marvel", // must not exist already in the `users` table
        "password": "foobar"          // needs to be hashed before it's saved
      }

    2- On SUCCESSFUL registration,
      the response body should have `id`, `username` and `password`:
      {
        "id": 1,
        "username": "Captain Marvel",
        "password": "2a$08$jG.wIGR2S4hxuyWNcBf9MuoC4y0dNy7qC/LbmtuFBSdIhWks2LhpG"
      }

    3- On FAILED registration due to `username` or `password` missing from the request body,
      the response body should include a string exactly as follows: "username and password required".

    4- On FAILED registration due to the `username` being taken,
      the response body should include a string exactly as follows: "username taken".
  */
});

router.post('/login', checkPassword, checkUsernameExists, (req, res, next) => {
  if (bcrypt.compareSync(req.body.password, req.user.password)) {
    const token = buildToken(req.user)
    res.status(200).json({message:`welcome, ${req.user.username}`, token})
  } else {
    next({status:401, message:'invalid credentials'})
  }
  /*
    IMPLEMENT
    You are welcome to build additional middlewares to help with the endpoint's functionality.

    1- In order to log into an existing account the client must provide `username` and `password`:
      {
        "username": "Captain Marvel",
        "password": "foobar"
      }

    2- On SUCCESSFUL login,
      the response body should have `message` and `token`:
      {
        "message": "welcome, Captain Marvel",
        "token": "eyJhbGciOiJIUzI ... ETC ... vUPjZYDSa46Nwz8"
      }

    3- On FAILED login due to `username` or `password` missing from the request body,
      the response body should include a string exactly as follows: "username and password required".

    4- On FAILED login due to `username` not existing in the db, or `password` being incorrect,
      the response body should include a string exactly as follows: "invalid credentials".
  */
});

function buildToken(user) {
  const payload = {
    password: user.password
  }
  const options = {
    expiresIn: '1d'
  }
  const token = jwt.sign(
    payload,
    JWT_SECRET,
    options,
  )
  return token
}

module.exports = router;
