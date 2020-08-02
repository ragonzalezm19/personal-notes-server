const jwt = require('jsonwebtoken')
const { model } = require('../models/user')
const User = require('./../models/user')

/**
 * Verify Token
 */
const verifyToken = (req, res, next) => {
  const token = req.get('Token')

  jwt.verify(token, process.env.SEED, (err, decoded) => {
    if (err) {
      return res.status(401).json({
        err: {
          message: 'Invalid token'
        }
      })
    }

    req.user = decoded.user
    next()
  })
}

/**
 * Validate data before register new user
 */
const validateNewUserData = (req, res, next) => {
  const body = req.body

  if (!body.name) {
    return res.status(400).json({
      err: {
        message: 'Name is required'
      }
    })
  }

  if (!body.email) {
    return res.status(400).json({
      err: {
        message: 'Email is required'
      }
    })
  }

  if (!body.password) {
    return res.status(400).json({
      err: {
        message: 'Password is required'
      }
    })
  }

  next()
}

/**
 * Valitade email duplicity
 */
const verifyEmailDuplicity = (req, res, next) => {
  const email = req.body.email

  User.findOne({ email }, (err, userFound) => {
    if (err) {
      return res.status(500).json({
        err: {
          message: 'Error'
        }
      })
    }

    if (userFound) {
      return res.status(400).json({
        err: {
          message: 'User already register.'
        }
      })
    }

    next()
  })
}

module.exports = {
  verifyToken,
  validateNewUserData,
  verifyEmailDuplicity
}