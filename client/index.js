import { io } from 'socket.io-client'

const $join = document.querySelector('.join')
const $leave = document.querySelector('.leave')
const $events = document.querySelector('.events')

let socket

document.addEventListener('DOMContentLoaded', () => {

  fetch('/api/events')
    .then(res => res.json())
    .then(events => {
      events.forEach(([eventType, payload]) => {
        const $event = eventType === 'user_joined'
          ? renderUserJoined(payload)
          : renderUserLeft(payload)
        $events.appendChild($event)
      })
    })

  $join.addEventListener('submit', event => {
    event.preventDefault()
    socket = io('/', {
      query: {
        username: event.target.elements.username.value
      }
    })
    event.target.reset()
    event.target.classList.add('hidden')
    $leave.classList.remove('hidden')
    socket.on('user_joined', payload => {
      $events.appendChild(renderUserJoined(payload))
    })
    socket.on('user_left', payload => {
      $events.appendChild(renderUserLeft(payload))
    })
  })

  $leave.addEventListener('click', () => {
    $leave.classList.add('hidden')
    $join.classList.remove('hidden')
    socket.disconnect()
  })

})

function renderUserJoined(payload) {
  const $event = document.createElement('li')
  $event.textContent = `user "${payload.username}" has joined`
  return $event
}

function renderUserLeft(payload) {
  const $event = document.createElement('li')
  $event.textContent = `user "${payload.username}" has left`
  return $event
}
