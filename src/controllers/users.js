const usersRouter = require('express').Router()
const User = require('../models/user')
const bcrypt = require('bcrypt')

const formatUser  = (user) => {
  return {
    username: user.username,
    name: user.name,
    adult: user.adult,
    id: user._id }
}

usersRouter.get('/', async (request, response) => {
  try {
    const users = await User.find({})
    response.json(users.map(formatUser))
  }
  catch(exception) {
    console.log('Error:', exception)
  }})

usersRouter.post('/', async (request, response) => {
  try {
    const body = request.body

    const existingUser = await User.find({ username : body.username })
    console.log('existing user: ', existingUser)
    if (existingUser.length) {
      response.status(400).json({ error: 'username already exists' })
      return
    }
    if (body.password.length < 3) {
      response.status(400).json({ error: 'password too short, must be at least 3 characters'})
      return
    }


    const saltRounds = 10
    const passwordHash = await bcrypt.hash(body.password, saltRounds)

    const user = new User({
      username: body.username,
      name: body.name,
      adult: body.adult,
      passwordHash
    })


    const result = await user.save()
    response.status(201).json(result)
  } catch (exception) {
    console.log(exception)
    response.status(500).json({ error: 'something went wrong...' })
  }
})

module.exports = usersRouter
