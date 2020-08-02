require('./config/config')

const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const app = express()

const OPTION_CONNECT = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true
}

app.use(bodyParser.json())
app.use(require('./routes/index'))

mongoose.connect(process.env.URL_DB, OPTION_CONNECT, (err, res) => {
  if (err) throw err

  console.log('Connected to data base')
})

app.listen(process.env.PORT, () => {
  console.log(`Listen on port ${process.env.PORT}`)
})