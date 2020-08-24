const express = require('express')
const Note = require('./../models/notes')
const { verifyToken } = require('../middlewares/auth')
const notes = require('./../models/notes')
const app = express()

app.get('/notes', [verifyToken], async(req, res) => {
  const user = req.user
  const notes = await Note.find({ user: user._id })
  if (!notes) {
    return res.status(404).json({
      err: {
        message: 'User without notes'
      }
    })
  }

  res.json({
    notes
  })
})

app.get('/notes/:id', [verifyToken], async(req, res) => {
  const id = req.params.id

  const note = await notes.findById(id)
  if (!note) {
    return res.status(404).json({
      err: {
        message: 'Note not found'
      }
    })
  }

  if (!note.user.equals(req.user._id)) {
    return res.status(403).json({
      err: {
        message: 'User without permissions'
      }
    })
  }

  res.json({
    note
  })
})

app.post('/notes', [verifyToken], (req, res) => {
  const body = req.body
  const user = req.user

  const note = new Note({
    user: user._id,
    body
  })

  note.save((err, noteSaved) => {
    if (err) {
      return res.status(500).json({
        err
      })
    }

    res.json({
      note: noteSaved
    })
  })
})

app.put('/notes/:id', [verifyToken], async(req, res) => {
  const user = req.user
  const id = req.params.id
  const body = req.body
  const noteToUpdate = {
    body
  }

  const noteMatch = await Note.findOneAndUpdate({ _id: id, user: user._id }, noteToUpdate, { new: true })
  if (!noteMatch) {
    return res.status(404).json({
      err: {
        message: 'Note not found'
      }
    })
  }

  res.json({
    note: noteMatch
  })
})

app.delete('/notes/:id', [verifyToken], async(req, res) => {
  const id = req.params.id

  const note = await notes.findById(id)
  if (!note) {
    return res.status(404).json({
      err: {
        message: 'Note not found'
      }
    })
  }

  if (!note.user.equals(req.user._id)) {
    return res.status(403).json({
      err: {
        message: 'User without permissions'
      }
    })
  }

  const noteDeleted = await notes.deleteOne({ _id: id })
  if (!noteDeleted) {
    return req.status(500).json({
      err: {
        message: 'There was an error on delete note process'
      }
    })
  }

  res.json({
    note
  })

})

module.exports = app