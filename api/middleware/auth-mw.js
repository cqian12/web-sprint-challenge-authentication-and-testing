const db = require('../../data/dbConfig')

const checkUsername = async (req, res, next) => {
    const { username } = req.body
    try {
      if (!username) {
          next({status:401, message:'username and password required'})
      }

      const taken = await db('users').where('username', username).first()
  
      if (taken) {
       next({status:422, message:'username taken'})
      } else {
        req.user = req.body
        next()
      }
    } catch(err) {
      next(err)
    }
}

const checkPassword = (req, res, next) => {
    const { password } = req.body
    if (!password) {
        next({status:401, message:'username and password required'})
    } else if (password.trim().length < 4) {
        next({status:422, message:'password must be longer than 3 characters'})
    } else {
        next()
    }
}

const checkUsernameExists = async (req, res, next) => {
    try {
      const { username } = req.body
      if (!username) {
        next({status:401, message:'username and password required'})
      }

      const found = await db('users').where({ username: req.body.username }).first()
  
      if (!found) {
        next({status:401, message:'invalid credentials'})
      } else {
        req.user = found
        next()
      } 
    } catch(err) {
      next(err)
    }
  }

module.exports = {
    checkPassword,
    checkUsername,
    checkUsernameExists
}