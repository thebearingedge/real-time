require('dotenv/config')
const http = require('http')
const express = require('express')
const socketio = require('socket.io')

const events = []

/* setup server */

const app = express()                 // create request handler
const server = http.createServer(app) // create web server
const io = socketio(server)           // attach web socket handler

/* http req -> res */

app.get('/api/events', (req, res) => {
  res.json(events)
})

/* web <-> sockets */

io.on('connection', socket => {

  const { id } = socket
  const { username } = socket.handshake.query

  socket.join('lobby')
  events.push(['user_joined', { userId: id, username }])
  io.to('lobby').emit('user_joined', { userId: id, username })

  socket.on('disconnect', () => {
    io.to('lobby').emit('user_left', { userId: id, username })
    events.push(['user_left', { userId: id, username }])
  })

})

/* start server */

server.listen(process.env.PORT, () => {
  console.log('server listening on port', process.env.PORT)
})
