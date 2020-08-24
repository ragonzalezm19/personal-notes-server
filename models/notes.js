const mongoose = require('mongoose')

const Schema = mongoose.Schema
const notesSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  body: {
    type: Schema.Types.Mixed
  }
}, {
  timestamps: true
})

module.exports = mongoose.model('Note', notesSchema)