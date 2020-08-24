const express = require('express')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const User = require('./../models/user')
const { validateNewUserData, verifyEmailDuplicity } = require('./../middlewares/auth')
const app = express()

const singToken = (user) => {
  return jwt.sign({ user },
    process.env.SEED, { expiresIn: process.env.TOKEN_EXPIRATION }
  )
}

app.post('/auth/register', [validateNewUserData, verifyEmailDuplicity], async(req, res) => {
  let user = new User({
    name: req.body.name,
    email: req.body.email,
    password: bcrypt.hashSync(req.body.password, 10)
  })

  user.save((err, userSaved) => {
    if (err) {
      return res.status(500).json({
        err
      })
    }

    const token = singToken(userSaved)

    res.json({
      user: {
        name: userSaved.name,
        email: userSaved.email
      },
      token
    })
  })
})

app.post('/auth/login', async(req, res) => {
  let body = req.body

  const userFound = await User.findOne({ email: body.email })
  if (!userFound) {
    return res.status(404).json({
      err: {
        message: 'User not found'
      }
    })
  }

  if (!bcrypt.compareSync(body.password, userFound.password)) {
    return res.status(400).json({
      err: {
        messege: 'Email or password incorrect'
      }
    })
  }

  const token = singToken(userFound)

  res.json({
    user: {
      name: userFound.name,
      email: userFound.email
    },
    token
  })
})

module.exports = app